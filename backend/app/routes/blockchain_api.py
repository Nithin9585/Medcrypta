from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.blockchain.block_chain import Blockchain

blockchain_bp = Blueprint('blockchain', __name__, url_prefix='/api/blockchain')

# Initialize the blockchain
blockchain = Blockchain(validator_identity="validator")

@blockchain_bp.route('/add_block', methods=['POST'])
@jwt_required()
def add_block():
    data = request.json
    validator = request.headers.get('Validator')
    if not data or not validator:
        return jsonify({"error": "Invalid data or validator"}), 400
    
    block = blockchain.add_block(data, validator)
    return jsonify({"message": "Block added", "block": block.__dict__}), 201

@blockchain_bp.route('/get_block/<int:index>', methods=['GET'])
def get_block(index):
    block = next((blk for blk in blockchain.chain if blk.index == index), None)
    if not block:
        return jsonify({"error": "Block not found"}), 404
    
    return jsonify(block.__dict__), 200