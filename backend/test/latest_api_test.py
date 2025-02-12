import jwt
from app.app import app
from flask_jwt_extended import create_access_token
import pytest
import requests

from app.utils.mongo_wrapper import MongoDBManager

BASE_URL = "http://127.0.0.1:5000/api"


@pytest.fixture
def test_patient():

    return {
        "role": ["patient"],
        "username": "test_patient",
        "password": "password123",
        "details": {"age": 30, "medical_history": "None"},
    }


@pytest.fixture
def test_doctor():

    return {
        "role": "doctor",
        "username": "test_doctor",
        "password": "securepass",
        "details": {"specialization": "Cardiology", "license_verified": True},
    }


@pytest.fixture
def test_pharmacy():

    return {
        "role": "pharmacy",
        "username": "test_pharmacy",
        "password": "pharma123",
        "details": {"location": "Downtown"},
    }


@pytest.fixture
def test_validator():

    return {
        "role": "validator",
        "username": "validator_user",
        "password": "hashed_password_here",
        "details": {
            "username": "validator_user",
            "full_name": "Validator User",
            "email": "validator@example.com",
            "is_active": "true",
            "roles": ["validator"],
        },
    }


def test_patient_registration(test_patient):
    response = requests.post(f"{BASE_URL }/register/patient", json=test_patient)
    assert response.status_code == 201
    assert response.json()["success"] == True


def test_pharmacy_registration(test_pharmacy):
    response = requests.post(f"{BASE_URL }/register", json=test_pharmacy)
    assert response.status_code == 201
    assert response.json()["success"] == True


def test_invalid_role_registration():
    invalid_user = {
        "role": "hacker",
        "username": "test_hacker",
        "password": "hackme",
        "details": {"skills": "hacking"},
    }
    response = requests.post(f"{BASE_URL }/register", json=invalid_user)
    assert response.status_code == 400
    assert "Invalid role" in response.json()["error"]


def test_doctor_registration(test_doctor):

    response = requests.post(f"{BASE_URL }/register", json=test_doctor)
    assert response.status_code == 201
    pending_id = response.json().get("pending_id")

    assert pending_id is not None
    return pending_id


def ensure_validator_user_exists():
    with app.app_context():
        db = MongoDBManager.get_db()
        validator = db["users"].find_one({"username": "validator_user"})
        if not validator:

            db["users"].insert_one(
                {
                    "username": "validator_user",
                    "roles": ["validator"],
                    "password": "hashed_dummy_password",
                }
            )


def test_approve_doctor(test_doctor):

    registration_id = test_doctor_registration(test_doctor=test_doctor)

    ensure_validator_user_exists()

    with app.app_context():

        validator_token = create_access_token(
            identity="validator_user", additional_claims={"roles": ["validator"]}
        )

    headers = {"Authorization": f"Bearer {validator_token }"}

    approval_data = {"approved_by": "validator_user"}

    response = requests.post(
        f"{BASE_URL }/approve_registration/{registration_id }",
        json=approval_data,
        headers=headers,
    )

    assert (
        response.status_code == 200
    ), f"Approval failed with status {
    response .status_code } and message {response .text }"


def test_login(test_patient):
    login_data = {
        "role": "patient",
        "username": test_patient["username"],
        "password": test_patient["password"],
    }
    response = requests.post(f"{BASE_URL }/login", json=login_data)
    assert response.status_code == 200
    assert response.json()["success"] == True


def test_invalid_login(test_patient):
    login_data = {
        "role": "patient",
        "username": test_patient["username"],
        "password": "wrongpassword",
    }
    response = requests.post(f"{BASE_URL }/login", json=login_data)
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["error"]


def get_jwt_for_user(role, username, password):
    login_data = {"role": role, "username": username, "password": password}
    response = requests.post(f"{BASE_URL }/login", json=login_data)
    assert response.status_code == 200, f"Login failed: {response .text }"
    return response.json().get("access_token")


def get_jwt_for_validtor():
    with app.app_context():

        return create_access_token(identity="validator")


def test_get_details(test_patient):
    token = get_jwt_for_user(
        "patient", test_patient["username"], test_patient["password"]
    )

    decoded_token = jwt.decode(token, options={"verify_signature": False})
    print(decoded_token)

    headers = {"Authorization": f"Bearer {token }"}
    response = requests.get(f"{BASE_URL }/patient/details", headers=headers)

    assert (
        response.status_code == 200
    ), f"Expected 200, got {
    response .status_code }: {response .text }"


def get_doctor_details():
    token = get_jwt_for_user(
        role="doctor", username="test_doctor", password="securepass"
    )
    headers = {"Authorization": f"Bearer {token }"}
    response = requests.get(f"{BASE_URL }/doctor/details", headers=headers)
    return response.json().get("data")


def get_patient_details():
    token = get_jwt_for_user(
        role="patient", username="test_patient", password="password123"
    )
    headers = {"Authorization": f"Bearer {token }"}
    response = requests.get(f"{BASE_URL }/patient/details", headers=headers)
    return response.json().get("data")


def test_register_prescription(test_patient, test_doctor):

    doctor_token = get_jwt_for_user(
        "doctor", test_doctor["username"], test_doctor["password"]
    )

    headers = {"Authorization": f"Bearer {doctor_token }"}

    prescription_data = {
        "patient_id": get_patient_details()["_id"],
        "doctor_id": get_doctor_details()["_id"],
        "medicines": ["Aspirin", "Ibuprofen"],
        "diagnosis": "Fever",
        "details": {
            "patient_username": test_patient["username"],
            "prescribed_by": test_doctor["username"],
        },
    }

    response = requests.post(
        f"{BASE_URL }/prescriptions", json=prescription_data, headers=headers
    )

    assert (
        response.status_code == 201
    ), f"Prescription registration failed: {response .text }"
    assert response.json()["message"] == "Prescription created successfully"


def test_patient_get_own_prescriptions(test_patient):

    patient_token = get_jwt_for_user(
        "patient", test_patient["username"], test_patient["password"]
    )

    headers = {"Authorization": f"Bearer {patient_token }"}
    id = get_patient_details()["_id"]
    print(f"Patient ID: {id }")
    response = requests.get(f"{BASE_URL }/prescriptions/{id }", headers=headers)

    assert (
        response.status_code == 200
    ), f"Fetching prescriptions failed: {response .text }"

    prescriptions = response.json()
    assert isinstance(prescriptions, list), "Expected a list of prescriptions"

    for pres in prescriptions:
        assert (
            pres["patient_id"] == test_patient["username"]
        ), "Patient should only see their own prescriptions"


def test_doctor_get_all_prescriptions(test_doctor):

    doctor_token = get_jwt_for_user(
        "doctor", test_doctor["username"], test_doctor["password"]
    )

    headers = {"Authorization": f"Bearer {doctor_token }"}

    response = requests.get(f"{BASE_URL }/prescriptions", headers=headers)

    assert (
        response.status_code == 200
    ), f"Fetching all prescriptions failed: {response .text }"

    prescriptions = response.json()
    assert isinstance(prescriptions, list), "Expected a list of prescriptions"

    assert len(prescriptions) > 0, "There should be at least one prescription"
