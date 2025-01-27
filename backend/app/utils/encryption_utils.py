from cryptography .fernet import Fernet


SECRET_KEY = Fernet .generate_key()
cipher = Fernet(SECRET_KEY)


def encrypt_data(data: str) -> str:

    return cipher .encrypt(data .encode()).decode()


def decrypt_data(encrypted_data: str) -> str:

    return cipher .decrypt(encrypted_data .encode()).decode()
