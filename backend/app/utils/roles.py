from abc import ABC, abstractmethod
from .mongo_wrapper import MongoDBManager
from .encryption_utils import decrypt_data, encrypt_data
from bson import ObjectId


class User(ABC):

    credentials_collection = "users_credentials"
    details_collection = "users_details"

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password

    def verify(self) -> bool:

        db = MongoDBManager.get_db()
        logger = MongoDBManager._logger

        try:
            user_doc = db[self.__class__.credentials_collection].find_one(
                {"username": self.username}
            )
            if not user_doc:
                logger.warning(
                    f"User '{self .username }' not found in collection '{
                self .__class__ .credentials_collection }'."
                )
                return False

            try:
                stored_password = decrypt_data(user_doc["password"])
            except Exception as e:
                logger.error(
                    f"Error decrypting password for user '{
                self .username }': {e }"
                )
                return False

            if stored_password == self.password:
                logger.info(f"User '{self .username }' verified successfully.")
                return True
            else:
                logger.warning(
                    f"Password mismatch for user '{
                self .username }'."
                )
                return False

        except Exception as e:
            logger.error(
                f"Error during verification for user '{
            self .username }': {e }"
            )
            return False

    @classmethod
    def register(cls, username: str, password: str, details: dict) -> bool:

        db = MongoDBManager.get_db()
        logger = MongoDBManager._logger

        try:
            logger.info(f"Encrypting password for user '{username }'.")
            encrypted_password = encrypt_data(password)
        except Exception as e:
            logger.error(f"Error encrypting password for user '{username }': {e }")
            return False

        credentials_data = {"username": username, "password": encrypted_password}
        try:
            logger.info(
                f"Inserting credentials for user '{username }' into '{
            cls .credentials_collection }' collection."
            )
            credentials_result = db[cls.credentials_collection].insert_one(
                credentials_data
            )
        except Exception as e:
            logger.error(f"Error inserting credentials for user '{username }': {e }")
            return False

        details_data = {"username": username, **details}
        try:
            logger.info(
                f"Inserting details for user '{username }' into '{
            cls .details_collection }' collection."
            )
            details_result = db[cls.details_collection].insert_one(details_data)
        except Exception as e:
            logger.error(f"Error inserting details for user '{username }': {e }")

            return False

        logger.info(
            f"User '{username }' registered successfully in credentials '{
        cls .credentials_collection }' and details '{cls .details_collection }'."
        )
        return bool(credentials_result.inserted_id and details_result.inserted_id)

    @classmethod
    def get_details(cls, username: str) -> dict:

        db = MongoDBManager.get_db()
        logger = MongoDBManager._logger

        try:
            result = db[cls.details_collection].find_one({"username": username})
            if not result:
                logger.warning(
                    f"No details found for user '{
                username }' in collection '{cls .details_collection }'."
                )
                return None
            return cls.convert_objectid(result)
        except Exception as e:
            logger.error(
                f"Error retrieving details for user '{
            username }': {e }"
            )
            return None

    @staticmethod
    def convert_objectid(obj):

        if isinstance(obj, dict):
            return {k: User.convert_objectid(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [User.convert_objectid(item) for item in obj]
        elif isinstance(obj, ObjectId):
            return str(obj)
        return obj


class Patient(User):

    credentials_collection = "patients_credentials"
    details_collection = "patients_details"


class Doctor(User):

    credentials_collection = "doctors_credentials"
    details_collection = "doctors_details"

    def verify(self) -> bool:

        logger = MongoDBManager._logger
        if not super().verify():
            return False

        db = MongoDBManager.get_db()
        try:
            doctor_doc = db[self.__class__.details_collection].find_one(
                {"username": self.username}
            )
            if doctor_doc is None:
                logger.warning(
                    f"No details found for doctor '{self .username }' in collection '{
                self .__class__ .details_collection }'."
                )
                return False
            logger.info(f"{doctor_doc }")
            if doctor_doc.get("license_verified", False):
                logger.info(
                    f"Doctor '{self .username }' license verified successfully."
                )
                return True
            else:
                logger.warning(
                    f"Doctor '{self .username }' license verification failed."
                )
                return False

        except Exception as e:
            logger.error(f"Error verifying doctor '{self .username }': {e }")
            return False


class Pharmacy(User):

    credentials_collection = "pharmacies_credentials"
    details_collection = "pharmacies_details"

    def verify(self) -> bool:

        logger = MongoDBManager._logger
        if not super().verify():
            return False

        db = MongoDBManager.get_db()
        try:
            pharmacy_doc = db[self.__class__.details_collection].find_one(
                {"username": self.username}
            )
            if pharmacy_doc is None:
                logger.warning(
                    f"No details found for pharmacy '{
                self .username }' in collection '{self .__class__ .details_collection }'."
                )
                return False

            if pharmacy_doc.get("approval_status") == "approved":
                logger.info(f"Pharmacy '{self .username }' is approved.")
                return True
            else:
                logger.warning(f"Pharmacy '{self .username }' is not approved.")
                return False

        except Exception as e:
            logger.error(f"Error verifying pharmacy '{self .username }': {e }")
            return False


class Validator(User):

    credentials_collection = "validators_credentials"
    details_collection = "validators_details"

    def verify(self) -> bool:

        logger = MongoDBManager._logger
        if not super().verify():
            return False

        db = MongoDBManager.get_db()
        try:
            validator_doc = db[self.__class__.details_collection].find_one(
                {"username": self.username}
            )
            if validator_doc is None:
                logger.warning(
                    f"No details found for validator '{
                self .username }' in collection '{self .__class__ .details_collection }'."
                )
                return False

            if validator_doc.get("is_active", False):
                logger.info(f"Validator '{self .username }' is active.")
                return True
            else:
                logger.warning(f"Validator '{self .username }' is not active.")
                return False

        except Exception as e:
            logger.error(f"Error verifying validator '{self .username }': {e }")
            return False


if __name__ == "__main__":

    doctor_details = {
        "full_name": "Dr. Alice Smith",
        "specialization": "Cardiology",
        "license_verified": True,
        "roles": ["doctor", "user"],
    }
    if Doctor.register("dr_alice", "securepassword", doctor_details):
        MongoDBManager._logger.info("Doctor registered successfully.")

    doctor_instance = Doctor("dr_alice", "securepassword")
    if doctor_instance.verify():
        MongoDBManager._logger.info("Doctor verified successfully.")
    else:
        MongoDBManager._logger.info("Doctor verification failed.")

    details = Doctor.get_details("dr_alice")
    if details:
        MongoDBManager._logger.info("Retrieved doctor details:")
        MongoDBManager._logger.info(details)
