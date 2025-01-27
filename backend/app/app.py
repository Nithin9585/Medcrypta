from flask import Flask
from .utils .mongo_wrapper import MongoDBManager
from .loader import ConfigLoader


def create_app():

    app = Flask(__name__)

    try:
        app .config["MONGO_URI"] = ConfigLoader .get_env_variable("MONGO_URI")
        app .config["SECRET_KEY"] = ConfigLoader .get_env_variable(
            "SECRET_KEY")
    except KeyError as e:
        raise RuntimeError(f"Missing required environment variable: {e}")

    MongoDBManager .init_app(app)

    from app .routes .mongo_api import main_bp
    app .register_blueprint(main_bp)

    @app .cli .command("shutdown")
    def shutdown():
        MongoDBManager .close_connection()

    return app


app = create_app()


if __name__ == "__main__":
    app .logger .info(f"""Starting Flask app with MongoDB URI: {
        app .config['MONGO_URI']}""")
    app .run(debug=True)
