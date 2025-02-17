import pytest
import requests

BASE_URL = "http://localhost:5000/api"

TEST_USER = {
    "role": "patient",
    "username": "test_user_1",
    "password": "test_password",
    "details": {"name": "Test User", "age": 30, "gender": "male"},
}


def cleanup_user(role, username):
    """Deletes test user after test execution (if needed)."""
    try:
        response = requests.delete(f"{BASE_URL}/user/{role}/{username}")
        if response.status_code != 200:
            print(f"Cleanup failed: {response.json()}")
    except Exception as e:
        print(f"Error during cleanup: {e}")


def test_register_user():
    try:
        response = requests.post(f"{BASE_URL}/register", json=TEST_USER)
        print(response.json())

        assert response.status_code == 201, f"Expected 201 but got {response.status_code}"

        assert response.json() == {
            "success": True,
            "message": "Patient registered successfully",
        }, f"Unexpected response: {response.json()}"

        print("User registration test passed successfully!")

    except requests.exceptions.RequestException as e:
        print(f"Error during API request: {e}")
    except AssertionError as e:
        print(f"Assertion failed: {e}")


def test_login_user():
    login_data = {
        "role": TEST_USER["role"],
        "username": TEST_USER["username"],
        "password": TEST_USER["password"],
    }
    response = requests.post(f"{BASE_URL}/login", json=login_data)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json() == {"success": True, "message": "Login successful"}

    cleanup_user(TEST_USER["role"], TEST_USER["username"])


def test_get_user_details():
    details_data = {"role": TEST_USER["role"], "username": TEST_USER["username"]}
    
    response = requests.get(f"{BASE_URL}/details", params=details_data)  # FIXED

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json() == {
        "success": True,
        "data": {"username": TEST_USER["username"], **TEST_USER["details"]},
    }

    cleanup_user(TEST_USER["role"], TEST_USER["username"])
