from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.blockchain.block_chain import Blockchain, PRESCRIPTION_SMART_CONTRACTS
from .middleware import role_required

blockchain_bp = Blueprint("blockchain", __name__, url_prefix="/api/blockchain")

blockchain = Blockchain(validator_identity="validator")


@blockchain_bp.route("/add_transaction", methods=["POST"])
@jwt_required()
@role_required("validator")
def add_transaction():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    blockchain.add_transaction(data)
    return jsonify({"message": "Transaction added"}), 201


@blockchain_bp.route("/add_block", methods=["POST"])
@jwt_required()
@role_required("validator")
def add_block():
    data = request.json
    validator = request.headers.get("Validator")
    consensus = request.args.get("consensus", "PoW")
    difficulty = int(request.args.get("difficulty", 2))
    if not data or not validator:
        return jsonify({"error": "Invalid data or validator"}), 400
    try:
        block = blockchain.add_block(validator, consensus, difficulty)
        return jsonify({"message": "Block added", "block": block.__dict__}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/deploy_contract", methods=["POST"])
@jwt_required()
@role_required("validator")
def deploy_contract():
    data = request.json
    contract_name = data.get("contract_name")
    contract_code = data.get("contract_code")
    if not contract_name or not contract_code:
        return jsonify({"error": "Invalid data"}), 400

    try:
        blockchain.deploy_contract(contract_name, contract_code)
        return (
            jsonify(
                {
                    "message": "Contract deployed successfully",
                    "contract_name": contract_name,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/execute_contract", methods=["POST"])
@jwt_required()
@role_required("validator")
def execute_contract():
    data = request.json
    contract_name = data.get("contract_name")
    function_name = data.get("function_name")
    args = data.get("args", [])

    if not contract_name or not function_name:
        return jsonify({"error": "Missing contract_name or function_name"}), 400

    try:
        result = blockchain.execute_contract(contract_name, function_name, *args)
        contract = blockchain.smart_contracts.get(contract_name)
        events = contract.events if contract else []

        return (
            jsonify(
                {
                    "message": "Contract executed successfully",
                    "result": result,
                    "events": events,
                }
            ),
            200,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/deploy_default_contracts", methods=["POST"])
@jwt_required()
@role_required("validator")
def deploy_default_contracts():
    try:
        blockchain.deploy_default_contracts()
        return (
            jsonify(
                {
                    "message": "Default prescription contracts deployed successfully",
                    "contracts": list(PRESCRIPTION_SMART_CONTRACTS.keys()),
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/get_block/<int:index>", methods=["GET"])
def get_block(index):
    try:
        block = next((blk for blk in blockchain.chain if blk.index == index), None)
        if not block:
            return jsonify({"error": "Block not found"}), 404

        return jsonify(block.__dict__), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/get_chain", methods=["GET"])
def get_chain():
    try:
        chain_data = [block.__dict__ for block in blockchain.chain]
        return jsonify(chain_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/get_last_block", methods=["GET"])
def get_last_block():
    try:
        last_block = blockchain.get_last_block()
        return jsonify(last_block.__dict__), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blockchain_bp.route("/is_chain_valid", methods=["GET"])
def is_chain_valid():
    try:
        is_valid = blockchain.is_chain_valid()
        return jsonify({"is_valid": is_valid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
