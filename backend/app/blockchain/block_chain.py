import hashlib
import json
from time import time
from typing import Any, Dict, List
from app.utils.mongo_wrapper import MongoDBManager
import random
from datetime import datetime


class Block:
    def __init__(
        self,
        index: int,
        timestamp: float,
        data: Dict[str, Any],
        previous_hash: str,
        validator: str,
    ) -> None:
        self.index: int = index
        self.timestamp: float = timestamp
        self.data: Dict[str, Any] = data
        self.previous_hash: str = previous_hash
        self.validator: str = validator
        self.hash: str = self.compute_hash()

    def compute_hash(self) -> str:
        block_string: str = json.dumps(
            {
                "index": self.index,
                "timestamp": self.timestamp,
                "data": self.data,
                "previous_hash": self.previous_hash,
                "validator": self.validator,
            },
            sort_keys=True,
        )
        return hashlib.sha256(block_string.encode()).hexdigest()


class Blockchain:
    def __init__(self, validator_identity: str) -> None:
        self.chain: List[Block] = []
        self.pending_transactions: List[Dict[str, Any]] = []
        self.smart_contracts: Dict[str, SmartContract] = {}
        self.validator_identity: str = validator_identity
        self.create_genesis_block()
        self.load_chain()

    def deploy_contract(self, contract_name: str, contract_code: str) -> None:
        self.smart_contracts[contract_name] = SmartContract(contract_code)

    def execute_contract(self, contract_name: str, function_name: str, *args) -> Any:
        contract = self.smart_contracts.get(contract_name)
        if contract:
            return contract.execute(function_name, *args)
        else:
            raise ValueError("Contract not found")
    
    def proof_of_work(self, block: Block, difficulty: int) -> str:
        block.nonce = 0
        computed_hash = block.compute_hash()
        while not computed_hash.startswith('0' * difficulty):
            block.nonce += 1
            computed_hash = block.compute_hash()
        return computed_hash
    
    def proof_of_stake(self) -> str:
        return random.choice(self.validators)
    
    def create_genesis_block(self) -> None:
        genesis_block: Block = Block(
            0, time(), {"info": "Genesis Block"}, "0", "Genesis"
        )
        self.chain.append(genesis_block)
        self.save_chain()

    def get_last_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, transaction: Dict[str, Any]) -> None:
        self.pending_transactions.append(transaction)

    def add_block(self, data: Dict[str, Any], validator: str, consensus: str = 'PoW', difficulty: int = 2) -> Block:
        last_block: Block = self.get_last_block()
        new_block: Block = Block(
            index=last_block.index + 1,
            timestamp=time(),
            data=data,
            previous_hash=last_block.hash,
            validator=validator,
        )
        if consensus == 'PoW':
            new_block.hash = self.proof_of_work(new_block, difficulty)
        elif consensus == 'PoS':
            new_block.validator = self.proof_of_stake()
            new_block.hash = new_block.compute_hash()
        self.chain.append(new_block)
        self.pending_transactions = []
        self.save_chain()
        return new_block

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current: Block = self.chain[i]
            previous: Block = self.chain[i - 1]
            if current.hash != current.compute_hash():
                return False
            if current.previous_hash != previous.hash:
                return False
        return True
    def save_chain(self) -> None:
        with MongoDBManager() as db:
            db.blockchain.replace_one({}, {"chain": [block.__dict__ for block in self.chain]}, upsert=True)

    def load_chain(self) -> None:
        with MongoDBManager() as db:
            chain_data = db.blockchain.find_one()
            if chain_data:
                self.chain = [Block(**block_data) for block_data in chain_data["chain"]]
            else:
                self.create_genesis_block()

class SmartContract:
    def __init__(self, contract_code: str) -> None:
        self.contract_code = contract_code
        self.state = {}

    def execute(self, function_name: str, *args) -> Any:
        exec(self.contract_code)
        return locals()[function_name](*args)