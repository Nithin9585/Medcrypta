from flask import Flask, json
from flask_jwt_extended import JWTManager
from .utils.mongo_wrapper import MongoDBManager
from .loader import ConfigLoader


def create_app():

    app = Flask(__name__)

    try:
        app.config['JWT_SECRET_KEY'] = ConfigLoader.get_env_variable('JWT_SECRET_KEY')
        app.config["MONGO_URI"] = ConfigLoader.get_env_variable("MONGO_URI")
        app.config["SECRET_KEY"] = ConfigLoader.get_env_variable("SECRET_KEY")
        app.config["MONGO_DB_NAME"] = ConfigLoader.get_env_variable("MONGO_DB_NAME")
        app.config["JWT_SECRET_KEY"] = ConfigLoader.get_env_variable("JWT_SECRET_KEY")
        app.config["JWT_TOKEN_LOCATION"] = json.loads(
            ConfigLoader.get_env_variable("JWT_TOKEN_LOCATION")
        )
    except KeyError as e:
        print(f"Environment variable {e} not set.")
        return None

    MongoDBManager.init_app(app)
    jwt = JWTManager(app)

    from app.routes.mongo_api import main_bp

    app.register_blueprint(main_bp)
    from app.routes.authorized_api import admin_bp

    app.register_blueprint(admin_bp)
    from app.routes.blockchain_api import blockchain_bp
    app.register_blueprint(blockchain_bp)

    @app.cli.command("shutdown")
    def shutdown():
        MongoDBManager.close_connection()

    return app


app = create_app()


if __name__ == "__main__":
    app.logger.info(
        f"""Starting Flask app with MongoDB URI: {
        app .config['MONGO_URI']}"""
    )
    app.run(debug=True)
