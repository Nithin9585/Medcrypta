from functools import wraps
from flask import jsonify, current_app, request
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from ..utils.mongo_wrapper import MongoDBManager
from ..loader import ROLE_HEIRARCHY
from .__init__ import role_class_map


def has_permission(user_roles, required_role):

    for role in user_roles:
        if role == required_role or required_role in ROLE_HEIRARCHY.get(role, []):
            return True
    return False


def role_required(required_role):
    def decorator(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            try:
                jwt_claims = get_jwt()
                current_user = get_jwt_identity()
                current_app.logger.info(f"JWT Identity: {current_user }")
                db = MongoDBManager.get_db()

                role_class = role_class_map.get(required_role)
                if role_class and hasattr(role_class, "details_collection"):
                    collection_name = role_class.details_collection
                else:
                    collection_name = "users_details"

                current_app.logger.info(
                    f"Querying collection: {
                collection_name } for user: {current_user }"
                )
                user = db[collection_name].find_one({"username": current_user})

                if not user:
                    current_app.logger.warning(
                        f"User '{current_user }' not found in {collection_name }."
                    )
                    return jsonify({"message": "User not found"}), 404

                user_roles = jwt_claims.get("roles", [])
                current_app.logger.info(f"User Roles: {user_roles }")

                if not has_permission(user_roles, required_role):
                    current_app.logger.warning(
                        f"Access denied for {current_user }. Required role: {
                    required_role }. Found roles: {user_roles }"
                    )
                    return (
                        jsonify({"message": "Access Denied: Insufficient permissions"}),
                        403,
                    )

                return func(*args, **kwargs)
            except Exception as e:
                current_app.logger.error(f"Error in role-based middleware: {e }")
                return jsonify({"message": "Internal Server Error"}), 500

        return wrapper

    return decorator


def setup_logging_middleware(app):

    @app.before_request
    def log_request():

        app.logger.info(
            f"Incoming request: {request .method } {request .url } - Headers: {dict (request .headers )}"
        )

    @app.after_request
    def log_response(response):

        app.logger.info(
            f"Response: {response .status } for {request .method } {request .url }"
        )
        return response

    @app.errorhandler(500)
    def handle_500_error(e):

        app.logger.error(f"500 Error: {e } - Path: {request .path }")
        return "Internal Server Error", 500

    @app.errorhandler(404)
    def handle_404_error(e):

        app.logger.warning(f"404 Not Found: {request .url }")
        return "Page Not Found", 404
