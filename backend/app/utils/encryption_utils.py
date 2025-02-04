from cryptography.fernet import Fernet
from ..loader import ConfigLoader

SECRET_KEY = ConfigLoader.get_env_variable("SECRET_KEY")
cipher = Fernet(SECRET_KEY)


def encrypt_data(data: str) -> str:

    return cipher.encrypt(data.encode()).decode()


def decrypt_data(encrypted_data: str) -> str:

    return cipher.decrypt(encrypted_data.encode()).decode()
