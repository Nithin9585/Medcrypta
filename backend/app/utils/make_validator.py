from app.utils.roles import Validator
from app.utils.encryption_utils import encrypt_data as hash_password
from app.utils.mongo_wrapper import MongoDBManager
from flask import Flask


app = Flask(__name__)


app.config["MONGO_URI"] = "mongodb://localhost:27017/"
app.config["MONGO_DB_NAME"] = "test_db"


MongoDBManager.init_app(app)


def ensure_validator_user_exists():
    with app.app_context():
        db = MongoDBManager.get_db()

        # Check if validator exists in validators_credentials
        validator = db["validators_credentials"].find_one(
            {"username": "validator_user"}
        )

        if not validator:
            # Create validator credentials
            validator_creds = {
                "username": "validator_user",
                "password": hash_password("validator_pass"),
                "roles": ["validator"],
            }
            db["validators_credentials"].insert_one(validator_creds)

            # Create validator details
            validator_details = {
                "username": "validator_user",
                "name": "System Validator",
                "department": "System Administration",
            }
            db["validators_details"].insert_one(validator_details)

        return True


username = "validator_user"
password = "secure_password"
details = {"email": "validator@example.com", "is_active": True}


if ensure_validator_user_exists():
    print("✅ Validator account created successfully.")
else:
    print("❌ Failed to create validator account.")
