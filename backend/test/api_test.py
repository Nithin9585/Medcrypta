import pytest
import requests


BASE_URL = "http://localhost:5000/api"


TEST_USER = {
    "role": "patient",
    "username": "test_user_1",
    "password": "test_password",
    "details": {
        "name": "Test User",
        "age": 30,
        "gender": "male"
    }
}


def test_register_user():

    try:

        response = requests .post(f"{BASE_URL}/register", json=TEST_USER)
        print(response .json())

        assert response .status_code == 201, f"Expected 201 but got {
            response .status_code}"
        print(response .json)

        assert response .json() == {
            "success": True,
            "message": "Patient registered successfully"
        }, f"Unexpected response: {response .json()}"

        print("User registration test passed successfully!")

    except requests .exceptions .RequestException as e:
        print(f"Error during API request: {e}")
    except AssertionError as e:
        print(f"Assertion failed: {e}")


test_register_user()
