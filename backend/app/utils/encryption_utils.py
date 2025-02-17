import os
import base64
import hashlib
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import hmac

from app.loader import ConfigLoader


MASTER_KEY = ConfigLoader.get_env_variable("SECRET_KEY").encode()


def derive_key(salt: bytes) -> bytes:

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend(),
    )
    return base64.urlsafe_b64encode(kdf.derive(MASTER_KEY))


def encrypt_data(data: str) -> dict:

    salt = os.urandom(16)
    key = derive_key(salt)
    cipher = Fernet(key)

    encrypted_data = cipher.encrypt(data.encode())

    hmac_value = hmac.new(MASTER_KEY, encrypted_data, hashlib.sha256).hexdigest()

    return {
        "encrypted": encrypted_data.decode(),
        "salt": base64.b64encode(salt).decode(),
        "hmac": hmac_value,
    }


def decrypt_data(encrypted_obj: dict) -> str:

    try:
        encrypted_data = encrypted_obj["encrypted"].encode()
        salt = base64.b64decode(encrypted_obj["salt"])

        expected_hmac = hmac.new(MASTER_KEY, encrypted_data, hashlib.sha256).hexdigest()
        if expected_hmac != encrypted_obj["hmac"]:
            raise ValueError("Data integrity check failed!")

        key = derive_key(salt)
        cipher = Fernet(key)

        return cipher.decrypt(encrypted_data).decode()
    except Exception as e:
        print(f"Decryption error: {e}")
        return None
