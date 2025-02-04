import os
from dotenv import load_dotenv

ENV = os.getenv("FLASK_ENV", "development")
env_file = f".env.{ENV}"

load_dotenv(env_file)


ROLE_HEIRARCHY = {
    "validator": ["validator"],
    "user": [],
    "patient": ["patient"],
    "doctor": ["validator", "doctor"],
    "pharmacy": ["validator", "pharmacy"],
}


class ConfigLoader:
    @staticmethod
    def get_env_variable(key: str, default=None):
        value = os.getenv(key, default)
        if value is None:
            raise EnvironmentError(f"Required environment variable '{key}' is not set.")
        return value


if __name__ == "__main__":
    print(ConfigLoader.get_env_variable("MONGO_URI"))
