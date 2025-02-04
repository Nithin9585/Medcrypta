import atexit
from pymongo import MongoClient


class MongoDBManager:
    _client = None
    _db = None
    _logger = None

    @classmethod
    def init_app(cls, app):

        if not cls._client:
            try:
                uri = app.config.get("MONGO_URI")
                db_name = app.config.get("MONGO_DB_NAME", "default_db")

                cls._client = MongoClient(uri)
                cls._db = cls._client[db_name]
                cls._logger = app.logger
                atexit.register(cls.close_connection)
                cls._logger.info(
                    f"MongoDB connection established with database '{db_name}'."
                )
            except Exception as e:
                cls._logger.error(f"Failed to connect to MongoDB: {e}")
                raise

    @classmethod
    def get_db(cls):

        if cls._db is None:
            raise RuntimeError("MongoDB not initialized. Call init_app first.")
        return cls._db

    @classmethod
    def close_connection(cls, exception=None):

        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None
            if exception:
                cls._logger.error(
                    f"MongoDB connection closed due to error: {exception}"
                )
            else:
                if cls._logger:

                    cls._logger.info("MongoDB connection closed.")

    def __enter__(self):

        if not self._db:
            raise RuntimeError("MongoDB not initialized. Call init_app first.")
        return self._db

    def __exit__(self, exc_type, exc_value, traceback):

        self.close_connection()
