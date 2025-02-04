from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
from bson import ObjectId

from app.utils.encryption_utils import decrypt_data
from ..utils.mongo_wrapper import MongoDBManager
from .middleware import role_required
from .__init__ import role_class_map


admin_bp = Blueprint("admin", __name__, url_prefix="/api")


@admin_bp.route("/approve_registration/<registration_id>", methods=["POST"])
@jwt_required()
@role_required("validator")
def approve_registration(registration_id):

    current_user = get_jwt_identity()
    db = MongoDBManager.get_db()

    approver = db["users"].find_one({"username": current_user})
    if not approver:
        logging.warning(f"Approval attempt by unknown user: {current_user}")
        return jsonify({"error": "Approver not found"}), 404

    approver_roles = approver.get("roles", [])
    logging.info(
        f"User {current_user} (Roles: {
        approver_roles}) is attempting to approve a registration."
    )

    try:
        reg_id = ObjectId(registration_id)
        pending_user = db["pending_registrations"].find_one(
            {"_id": reg_id, "status": "pending"}
        )
        if not pending_user:
            logging.warning(
                f"Invalid approval attempt: No pending registration for ID {
                registration_id}"
            )
            return jsonify({"error": "Pending registration not found"}), 404
    except Exception as e:
        logging.error(f"Error fetching pending registration: {e}")
        return jsonify({"error": "Invalid registration ID"}), 400

    requested_role = pending_user.get("role")
    allowed_approvers = pending_user.get("approver_roles")

    if not any(role in allowed_approvers for role in approver_roles):
        logging.warning(
            f"User {current_user} (Roles: {
            approver_roles}) attempted unauthorized approval for {requested_role}."
        )
        return (
            jsonify(
                {"error": "You do not have permission to approve this registration"}
            ),
            403,
        )

    role_class = role_class_map.get(requested_role)
    if not role_class:
        return jsonify({"error": "Invalid role in pending registration"}), 400

    try:

        decrypted_password = decrypt_data(pending_user["password"])
        if role_class.register(
            pending_user["username"], decrypted_password, pending_user["details"]
        ):
            db["pending_registrations"].delete_one({"_id": reg_id})
            logging.info(
                f"User {current_user} approved registration for {
                pending_user['username']} ({requested_role})."
            )
            return jsonify({"success": True, "message": "Registration approved"}), 200
        else:
            logging.error(
                f"Approval failed: Could not register user {
                pending_user['username']}"
            )
            return jsonify({"error": "Failed to approve registration"}), 500
    except Exception as e:
        logging.error(f"Error approving registration: {e}")
        return jsonify({"error": str(e)}), 500
