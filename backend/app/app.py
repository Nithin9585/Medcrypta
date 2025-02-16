import logging.config
import os
from flask import Flask, json
from flask_jwt_extended import JWTManager
from pythonjsonlogger import jsonlogger
from app.routes.middleware import setup_logging_middleware
from .utils.mongo_wrapper import MongoDBManager
from .loader import ConfigLoader

if not os.path.exists("logs"):
    os.makedirs("logs")


if os.path.exists("config/logging.conf"):
    logging.config.fileConfig("config/logging.conf")
else:
    print("⚠️ Logging config file not found. Using default logging.")
    log_handler = logging.handlers.RotatingFileHandler(
        "logs/app.log", maxBytes=100000, backupCount=5
    )
    log_formatter = jsonlogger.JsonFormatter(
        fmt="%(asctime)s %(levelname)s %(message)s %(module)s %(funcName)s %(lineno)d"
    )
    log_handler.setFormatter(log_formatter)

    app_logger = logging.getLogger("appLogger")
    app_logger.setLevel(logging.DEBUG)
    app_logger.addHandler(log_handler)


def create_app():

    app = Flask(__name__)

    try:
        app.config["MONGO_URI"] = ConfigLoader.get_env_variable("MONGO_URI")
        app.config["SECRET_KEY"] = ConfigLoader.get_env_variable("SECRET_KEY")
        app.config["MONGO_DB_NAME"] = ConfigLoader.get_env_variable("MONGO_DB_NAME")
        app.config["JWT_SECRET_KEY"] = ConfigLoader.get_env_variable("JWT_SECRET_KEY")
        app.config["JWT_TOKEN_LOCATION"] = json.loads(
            ConfigLoader.get_env_variable("JWT_TOKEN_LOCATION")
        )
    except KeyError as e:
        raise RuntimeError(f"Missing required environment variable: {e }")

    MongoDBManager.init_app(app)
    jwt = JWTManager(app)

    setup_logging_middleware(app)

    from app.routes.mongo_api import main_bp

    app.register_blueprint(main_bp)
    from app.routes.authorized_api import admin_bp

    app.register_blueprint(admin_bp)
    from app.routes.prescription import prescription_bp

    app.register_blueprint(prescription_bp)

    @app.cli.command("shutdown")
    def shutdown():
        MongoDBManager.close_connection()

    return app


app = create_app()


if __name__ == "__main__":
    app.logger.info(
        f"""Starting Flask app with MongoDB URI: {
    app .config ['MONGO_URI']}"""
    )
    app.run(debug=True)
