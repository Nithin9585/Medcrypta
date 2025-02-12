from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.blockchain.block_chain import Blockchain

blockchain_bp = Blueprint("blockchain", __name__, url_prefix="/api/blockchain")

# Initialize the blockchain
blockchain = Blockchain(validator_identity="validator")


@blockchain_bp.route("/add_block", methods=["POST"])
@jwt_required()
def add_block():
    data = request.json
    validator = request.headers.get("Validator")
    if not data or not validator:
        return jsonify({"error": "Invalid data or validator"}), 400

    block = blockchain.add_block(data, validator)
    return jsonify({"message": "Block added", "block": block.__dict__}), 201


@blockchain_bp.route("/get_block/<int:index>", methods=["GET"])
def get_block(index):
    block = next((blk for blk in blockchain.chain if blk.index == index), None)
    if not block:
        return jsonify({"error": "Block not found"}), 404

    return jsonify(block.__dict__), 200


@blockchain_bp.route("/get_chain", methods=["GET"])
def get_chain():
    chain_data = [block.__dict__ for block in blockchain.chain]
    return jsonify(chain_data), 200


@blockchain_bp.route("/get_last_block", methods=["GET"])
def get_last_block():
    last_block = blockchain.get_last_block()
    return jsonify(last_block.__dict__), 200


@blockchain_bp.route("/is_chain_valid", methods=["GET"])
def is_chain_valid():
    is_valid = blockchain.is_chain_valid()
    return jsonify({"is_valid": is_valid}), 200
