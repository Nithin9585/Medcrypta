from app.utils.roles import Validator
from app.utils.mongo_wrapper import MongoDBManager
from flask import Flask


app = Flask(__name__)


app.config["MONGO_URI"] = "mongodb://root:example@localhost:27017/"
app.config["MONGO_DB_NAME"] = "test_db"


MongoDBManager.init_app(app)


username = "validator_user"
password = "secure_password"
details = {"email": "validator@example.com", "is_active": True}


if Validator.register(username, password, details):
    print("✅ Validator account created successfully.")
else:
    print("❌ Failed to create validator account.")
