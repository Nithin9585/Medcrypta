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
