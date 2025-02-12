import jwt
import pytest
import requests
from flask_jwt_extended import create_access_token
from app.app import app
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
        "details": {"specialization": "Cardiology"},
        "license_verified": True,
    }


def get_jwt_for_user(role, username, password):

    login_data = {"role": role, "username": username, "password": password}
    response = requests.post(f"{BASE_URL }/login", json=login_data)
    assert response.status_code == 200, f"Login failed: {response .text }"
    return response.json().get("access_token")


def test_login_patient(test_patient):
    login_data = {
        "role": "patient",
        "username": test_patient["username"],
        "password": test_patient["password"],
    }
    response = requests.post(f"{BASE_URL }/login", json=login_data)
    assert response.status_code == 200
    assert response.json()["success"] == True


def test_login_doctor(test_doctor):
    login_data = {
        "role": "doctor",
        "username": test_doctor["username"],
        "password": test_doctor["password"],
    }
    response = requests.post(f"{BASE_URL }/login", json=login_data)
    assert response.status_code == 200
    assert response.json()["success"] == True


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
    assert response.json()["message"] == "Prescription created successfully."


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
