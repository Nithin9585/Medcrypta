import logging
from flask import Blueprint, request, jsonify
from ..utils .mongo_utils import add_user, verify_user, add_user_details, get_user_details
main_bp = Blueprint('main', __name__, url_prefix='/api')


def check_required_fields(data, required_fields):

    missing_fields = [
        field for field in required_fields if not data .get(field)]

    if missing_fields:
        error_response = {"error": "Missing required fields",
                          "missing_fields": missing_fields}
        return missing_fields, error_response

    return [], None


@main_bp .route('/register', methods=['POST'])
def register():

    data = request .json
    required_fields = ['role', 'username', 'password', 'details']

    missing_fields, error_response = check_required_fields(
        data, required_fields)

    if missing_fields:
        logging .error(f"Missing fields: {', '.join(missing_fields)}")
        return jsonify(error_response), 400

    role, username, password, details = (
        data .get(field)for field in required_fields)

    if not isinstance(details, dict):
        return jsonify({"error": "'details' must be a dictionary."}), 400

    auth_collection = f"{role}s_auth"
    details_collection = f"{role}s_details"

    try:
        add_user(auth_collection, username, password)
        add_user_details(details_collection, {
            "username": username, **details})
        return jsonify({"success": True, "message": f"{role .capitalize()} registered successfully"}), 201
    except Exception as e:
        logging .error(f"Error during registration: {e}")
        return jsonify({"error": str(e)}), 500


@main_bp .route('/login', methods=['POST'])
def login():

    data = request .json
    required_fields = ['role', 'username', 'password']

    missing_fields, error_response = check_required_fields(
        data, required_fields)

    if missing_fields:
        return jsonify(error_response), 400

    role, username, password = (data[field]for field in required_fields)

    auth_collection = f"{role}s_auth"

    if verify_user(auth_collection, username, password):
        return jsonify({"success": True, "message": "Login successful"}), 200
    return jsonify({"error": "Invalid username or password"}), 401


@main_bp .route('/details', methods=['GET'])
def get_details():

    data = request .json
    required_fields = ['role', 'username']
    missing_fields, error_response = check_required_fields(
        data, required_fields)

    if missing_fields:
        return jsonify(error_response), 400

    role, username = (data[field]for field in required_fields)

    details_collection = f"{role}s_details"

    details = get_user_details(details_collection, username)
    if details:
        return jsonify({"success": True, "data": details}), 200
    return jsonify({"error": "User not found"}), 404
