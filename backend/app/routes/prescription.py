import datetime
from flask import Blueprint, request, jsonify
from bson import ObjectId
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.routes.middleware import role_required
from ..utils.mongo_wrapper import MongoDBManager

prescription_bp = Blueprint("prescriptions", __name__, url_prefix="/api")


@prescription_bp.route("/prescriptions", methods=["POST"])
def create_prescription():

    db = MongoDBManager.get_db()
    logger = MongoDBManager._logger

    data = request.json
    patient_id = data.get("patient_id")
    doctor_id = data.get("doctor_id")
    medicines = data.get("medicines", [])
    diagnosis = data.get("diagnosis", "")

    if not patient_id or not doctor_id:
        return jsonify({"error": "patient_id and doctor_id are required."}), 400

    try:

        patient_oid = ObjectId(patient_id)
        doctor_oid = ObjectId(doctor_id)
    except Exception:
        return jsonify({"error": "Invalid patient_id or doctor_id format."}), 400

    patient_exists = db["patients_details"].find_one({"_id": patient_oid})
    if not patient_exists:
        return jsonify({"error": "Invalid patient_id. Patient not found."}), 404

    doctor_exists = db["doctors_details"].find_one({"_id": doctor_oid})
    if not doctor_exists:
        return jsonify({"error": "Invalid doctor_id. Doctor not found."}), 404

    prescription_data = {
        "patient_id": patient_oid,
        "doctor_id": doctor_oid,
        "medicines": medicines,
        "diagnosis": diagnosis,
        "timestamp": request.json.get(
            "timestamp", datetime.datetime.now(datetime.timezone.utc).isoformat()
        ),
        "details": request.json.get("details", {}),
    }

    try:
        result = db["prescriptions"].insert_one(prescription_data)
        return (
            jsonify(
                {
                    "message": "Prescription created successfully.",
                    "id": str(result.inserted_id),
                }
            ),
            201,
        )
    except Exception as e:
        logger.error(f"Error inserting prescription: {e }")
        return jsonify({"error": "Failed to insert prescription."}), 500


@prescription_bp.route("/prescriptions", methods=["GET"])
@jwt_required()
@role_required("doctor")
def get_all_prescriptions():

    db = MongoDBManager.get_db()
    prescriptions = list(db["prescriptions"].find({}))

    for pres in prescriptions:
        pres["_id"] = str(pres["_id"])
        pres["patient_id"] = str(pres["patient_id"])
        pres["doctor_id"] = str(pres["doctor_id"])

    return jsonify(prescriptions), 200


@prescription_bp.route("/prescriptions/<string:patient_id>", methods=["GET"])
@jwt_required()
@role_required("patient")
def get_patient_prescriptions(patient_id):
    db = MongoDBManager.get_db()
    current_user = get_jwt_identity()
    patient = db["patients_details"].find_one({"username": current_user})

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    patient_oid = str(patient["_id"])

    if patient_id != patient_oid:
        return (
            jsonify(
                {"message": "Access Denied: Cannot view other patients' prescriptions"}
            ),
            403,
        )

    prescriptions = list(db["prescriptions"].find({"patient_id": ObjectId(patient_id)}))

    for pres in prescriptions:
        pres["_id"] = str(pres["_id"])
        pres["patient_id"] = str(pres["patient_id"])
        pres["doctor_id"] = str(pres["doctor_id"])

    return jsonify(prescriptions), 200
