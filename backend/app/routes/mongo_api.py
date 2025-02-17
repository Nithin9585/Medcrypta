from app.loader import ROLE_HEIRARCHY
from app.utils.encryption_utils import encrypt_data
from app.utils.mongo_wrapper import MongoDBManager
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from .__init__ import role_class_map
from app.routes.middleware import role_required

from ..utils.roles import Patient, Doctor, Validator

main_bp = Blueprint("main", __name__, url_prefix="/api")


def check_required_fields(data, required_fields):

    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        error_response = {
            "error": "Missing required fields",
            "missing_fields": missing_fields,
        }
        return missing_fields, error_response
    return [], None


@main_bp.route("/register/patient", methods=["POST"])
def register_patient():

    data = request.json
    required_fields = ["username", "password", "details"]
    missing_fields, error_response = check_required_fields(data, required_fields)
    if missing_fields:
        logging.error(
            f"Missing fields for patient registration: {
        ', '.join (missing_fields )}"
        )
        return jsonify(error_response), 400

    username = data.get("username")
    password = data.get("password")
    details = data.get("details")

    if not isinstance(details, dict):
        return jsonify({"error": "'details' must be a dictionary."}), 400

    try:
        if Patient.register(username, password, details):
            logging.info(f"Patient {username } registered successfully.")
            return (
                jsonify(
                    {"success": True, "message": "Patient registered successfully"}
                ),
                201,
            )
        else:
            return jsonify({"error": "Patient registration failed"}), 500
    except Exception as e:
        logging.error(f"Error during patient registration: {e }")
        return jsonify({"error": str(e)}), 500


@main_bp.route("/register", methods=["POST"])
def register_other_roles():

    data = request.json
    required_fields = ["role", "username", "password", "details"]
    missing_fields, error_response = check_required_fields(data, required_fields)

    if missing_fields:
        logging.error(
            f"Missing fields for registration: {
        ', '.join (missing_fields )}"
        )
        return jsonify(error_response), 400

    role = data.get("role").lower()
    username = data.get("username")
    password = data.get("password")
    details = data.get("details")

    if role == "patient":
        return jsonify({"error": "Use /register/patient for patient registration"}), 400

    if not isinstance(details, dict):
        return jsonify({"error": "'details' must be a dictionary."}), 400

    if role not in role_class_map:
        return jsonify({"error": f"Invalid role: {role }"}), 400

    db = MongoDBManager.get_db()

    try:
        pending_user = {
            "role": role,
            "username": username,
            "password": encrypt_data(password),
            "details": details,
            "status": "pending",
            "approver_roles": ROLE_HEIRARCHY.get(role, []),
        }
        result = db["pending_registrations"].insert_one(pending_user)

        logging.info(
            f"New {role } registration request for {
        username } pending approval."
        )
        return (
            jsonify(
                {
                    "success": True,
                    "message": f"Registration request submitted for approval",
                    "pending_id": str(result.inserted_id),
                }
            ),
            201,
        )

    except Exception as e:
        logging.error(f"Error during {role } registration request: {e }")
        return jsonify({"error": str(e)}), 500


@main_bp.route("/login", methods=["POST"])
def login():

    data = request.json
    required_fields = ["role", "username", "password"]
    missing_fields, error_response = check_required_fields(data, required_fields)
    if missing_fields:
        return jsonify(error_response), 400

    role = data.get("role").lower()
    username = data.get("username")
    password = data.get("password")

    role_class = role_class_map.get(role)
    if not role_class:
        return jsonify({"error": f"Invalid role: {role }"}), 400

    try:

        user_instance = role_class(username, password)
        if user_instance.verify():

            access_token = create_access_token(
                identity=username, additional_claims={"roles": [role]}
            )
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Login successful",
                        "access_token": access_token,
                    }
                ),
                200,
            )
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        logging.error(f"Error during login: {e }")
        return jsonify({"error": str(e)}), 500


@main_bp.route("/doctor/details", methods=["GET"])
@role_required("doctor")
def doctor_details():

    current_user = get_jwt_identity()
    details = Doctor.get_details(current_user)
    if details:
        return jsonify({"success": True, "data": details}), 200
    return jsonify({"error": "User not found"}), 404


@main_bp .route('/Registerdoctor', methods=['PUT'])
def Registerdoctor():
    data = request .json
    required_fields = ['fullName', 'email', 'phoneNumber',\
                        'dateOfBirth' ,'gender', 'address', 'specialization', \
                            'licenseNumber', 'licenseExpiry', 'hospitalName', \
                                'designation','experience'  ]

    missing_fields, error_response = check_required_fields(
        data, required_fields)

    if missing_fields:
        logging .error(f"Missing fields: {', '.join(missing_fields)}")
        return jsonify(error_response), 400

    fullName = data.get('fullName')
    email = data.get('email')
    phoneNumber = data.get('phoneNumber')
    dateOfBirth = data.get('dateOfBirth')
    gender = data.get('gender')
    address = data.get('address')
    specialization = data.get('specialization')
    licenseNumber = data.get('licenseNumber')
    licenseExpiry = data.get('licenseExpiry')
    hospitalName = data.get('hospitalName')
    designation = data.get('designation')
    experience = data.get('experience')

    if not email or '@' not in email:
        return jsonify({"error": "Invalid email format"}), 400

    if not phoneNumber or len(phoneNumber) != 10 or not phoneNumber.isdigit():
        return jsonify({"error": "Invalid phone number format"}), 400

    try:
        from datetime import datetime
        datetime.strptime(dateOfBirth, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date of birth format. Use YYYY-MM-DD"}), 400
    
    try:
        datetime.strptime(licenseExpiry, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid license expiry date format. Use YYYY-MM-DD"}), 400

    doctor_details = {
        "fullName": fullName,
        "email": email,
        "phoneNumber": phoneNumber,
        "dateOfBirth": dateOfBirth,
        "gender": gender,
        "address": address,
        "specialization": specialization,
        "licenseNumber": licenseNumber,
        "licenseExpiry": licenseExpiry,
        "hospitalName": hospitalName,
        "designation": designation,
        "experience": experience
    }
    # try:
    #     from hashlib import sha256
    #     registration_hash = sha256(str(doctor_details).encode()).hexdigest()
    #     logging.info(f"Doctor {fullName} registered successfully with hash {registration_hash}")
    #     return jsonify({
    #         "success": True,
    #         "message": "Doctor registered successfully",
    #         "registration_hash": registration_hash
    #     }), 201
    # except Exception as e:
    #     logging.error(f"Error during doctor registration: {e}", exc_info=True)
    #     return jsonify({"error": "An error occurred during registration. Please try again later."}), 500
    return jsonify({"error": "Doctor details not found"}), 404


@main_bp.route("/patient/details", methods=["GET"])
@role_required("patient")
def patient_details():

    current_user = get_jwt_identity()
    details = Patient.get_details(current_user)
    if details:
        return jsonify({"success": True, "data": details}), 200
    return jsonify({"error": "Patient details not found"}), 404


@main_bp.route("/validator/details", methods=["GET"])
@role_required("validator")
def validator_details():

    current_user = get_jwt_identity()
    details = Validator.get_details(current_user)
    if details:
        return jsonify({"success": True, "data": details}), 200
    return jsonify({"error": "Validator details not found"}), 404
