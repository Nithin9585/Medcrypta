from .encryption_utils import encrypt_data, decrypt_data
from flask import current_app
from .mongo_wrapper import MongoDBManager


def add_user(collection_name: str, username: str, password: str) -> bool:

    try:

        encrypted_password = encrypt_data(password)
        db = MongoDBManager.get_db()

        result = db[collection_name].insert_one(
            {"username": username, "password": encrypted_password}
        )

        if result.inserted_id:
            current_app.logger.info(
                f"User {username} added successfully to {collection_name}."
            )
            return True
        else:
            current_app.logger.warning(
                f"Failed to add user {username} to {collection_name}."
            )
            return False
    except Exception as e:
        current_app.logger.error(f"An error occurred while adding the user: {e}")
        return False


def verify_user(collection_name: str, username: str, password: str) -> bool:

    try:
        db = MongoDBManager.get_db()
        user = db[collection_name].find_one({"username": username})

        if not user:
            current_app.logger.warning(
                f"User {username} not found in {collection_name}."
            )
            return False

        stored_password = decrypt_data(user["password"])
        if stored_password == password:
            current_app.logger.info(f"User {username} verified successfully.")
            return True
        else:
            current_app.logger.warning(f"Password mismatch for user {username}.")
            return False
    except Exception as e:
        current_app.logger.error(f"Error verifying user {username}: {e}")
        return False


def add_user_details(collection_name: str, details: dict) -> bool:

    try:
        db = MongoDBManager.get_db()
        result = db[collection_name].insert_one(details)
        if result.inserted_id:
            current_app.logger.info(
                f"User details added to {
                                      collection_name}: {details}"
            )
            return True
        return False
    except Exception as e:
        current_app.logger.error(f"Error adding user details: {e}")
        return False


def get_user_details(collection_name: str, username: str) -> dict:

    current_app.logger.info(
        f"""Fetching details from collection: {
                              collection_name}, username: {username}"""
    )
    try:
        db = MongoDBManager.get_db()
        result = db[collection_name].find_one({"username": username})
        if not result:
            current_app.logger.warning(
                f"No user found in {collection_name} with username {username}."
            )
            return None
        return result
    except Exception as e:
        current_app.logger.error(f"Error retrieving user details: {e}")
        return None
