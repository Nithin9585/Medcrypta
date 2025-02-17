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
        nonce: int = 0,
        hash: str = None,
    ) -> None:
        self.index: int = index
        self.timestamp: float = timestamp
        self.data: Dict[str, Any] = data
        self.previous_hash: str = previous_hash
        self.validator: str = validator
        self.hash: str = self.compute_hash()
        self.nonce: int = nonce
        self.hash: str = hash or self.compute_hash()

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
        self.validators: List[str] = [validator_identity]
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
        while not computed_hash.startswith("0" * difficulty):
            block.nonce += 1
            computed_hash = block.compute_hash()
        return computed_hash

    def proof_of_stake(self) -> str:
        return random.choice(self.validators)

    def practical_byzantine_fault_tolerance(self, block: Block) -> str:
        # Simplified PBFT implementation for demonstration purposes
        # In a real-world scenario, this would involve multiple rounds of voting and consensus among nodes
        return block.compute_hash()

    def create_genesis_block(self) -> None:
        genesis_block: Block = Block(
            0, time(), {"info": "Genesis Block"}, "0", self.validator_identity
        )
        self.chain.append(genesis_block)
        self.save_chain()

    def get_last_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, transaction: Dict[str, Any]) -> None:
        self.pending_transactions.append(transaction)

    def add_block(
        self,
        data: Dict[str, Any],
        validator: str,
        consensus: str = "PoW",
        difficulty: int = 2,
    ) -> Block:
        last_block: Block = self.get_last_block()
        new_block = Block(
            len(self.chain),
            time(),
            {"transactions": self.pending_transactions},
            last_block.hash,
            validator,
        )
        if consensus == "PoW":
            new_block.hash = self.proof_of_work(new_block, difficulty)
        elif consensus == "PoS":
            new_block.validator = self.proof_of_stake()
            new_block.hash = new_block.compute_hash()
        elif consensus == "PBFT":
            new_block.hash = self.practical_byzantine_fault_tolerance(new_block)
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
            db.blockchain.replace_one(
                {}, {"chain": [block.__dict__ for block in self.chain]}, upsert=True
            )

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
        self.events = []

    def emit_event(self, event_name: str, data: Dict[str, Any]) -> None:
        self.events.append(
            {"name": event_name, "data": data, "timestamp": datetime.now().isoformat()}
        )

    def execute(self, function_name: str, *args) -> Any:
        # Create a new context with all required functions and modules
        context = {
            # Contract functions
            "emit_event": self.emit_event,
            "get_state": self.get_state,
            "update_state": self.update_state,
            # Required modules
            "datetime": datetime,
            # Contract state
            "state": self.state,
        }

        # First execute the contract code to define functions
        exec(self.contract_code, context)

        # Then execute the requested function
        if function_name not in context:
            raise ValueError(f"Function {function_name} not found in contract")

        return context[function_name](*args)

    def update_state(self, key: str, value: Any) -> None:
        self.state[key] = value

    def get_state(self, key: str) -> Any:
        return self.state.get(key)


# Add prescription smart contract templates
PRESCRIPTION_SMART_CONTRACTS = {
    "PrescriptionValidator": """
def validate_prescription(prescription_data):
    required_fields = ['patient_id', 'doctor_id', 'medicines', 'diagnosis']
    
    # Validate required fields
    for field in required_fields:
        if field not in prescription_data:
            emit_event('ValidationError', {'error': f'Missing required field: {field}'})
            return False
    
    # Validate medicines format
    medicines = prescription_data['medicines']
    if not isinstance(medicines, list) or not medicines:
        emit_event('ValidationError', {'error': 'Invalid medicines format'})
        return False
    
    for medicine in medicines:
        if not isinstance(medicine, dict) or 'name' not in medicine:
            emit_event('ValidationError', {'error': 'Invalid medicine format'})
            return False
    
    emit_event('PrescriptionValidated', {'prescription_id': str(prescription_data.get('_id'))})
    return True
""",
    "PrescriptionAccess": """
def check_access(user_id, user_role, prescription_data):
    patient_id = prescription_data.get('patient_id')
    doctor_id = prescription_data.get('doctor_id')
    
    if user_role == 'patient' and user_id != str(patient_id):
        emit_event('AccessDenied', {
            'user_id': user_id,
            'role': user_role,
            'prescription_id': str(prescription_data.get('_id'))
        })
        return False
        
    if user_role == 'doctor' and user_id != str(doctor_id):
        # Doctors can only view their own prescriptions
        emit_event('AccessDenied', {
            'user_id': user_id,
            'role': user_role,
            'prescription_id': str(prescription_data.get('_id'))
        })
        return False
    
    emit_event('AccessGranted', {
        'user_id': user_id,
        'role': user_role,
        'prescription_id': str(prescription_data.get('_id'))
    })
    return True
""",
    "PrescriptionHistory": """
def record_prescription_update(prescription_id, update_type, updated_by):
    current_history = get_state(f'prescription_history_{prescription_id}') or []
    
    update_record = {
        'timestamp': datetime.now().isoformat(),
        'type': update_type,
        'updated_by': updated_by
    }
    
    current_history.append(update_record)
    update_state(f'prescription_history_{prescription_id}', current_history)
    
    emit_event('PrescriptionHistoryUpdated', {
        'prescription_id': prescription_id,
        'update_type': update_type,
        'updated_by': updated_by
    })
    return current_history
""",
    "MedicineDispenser": """
def dispense_medicine(prescription_id, pharmacy_id, medicine_name):
    dispensing_history = get_state(f'dispensing_history_{prescription_id}') or {}
    
    if medicine_name in dispensing_history:
        emit_event('DispensingError', {
            'error': 'Medicine already dispensed',
            'prescription_id': prescription_id,
            'medicine': medicine_name
        })
        return False
    
    dispensing_history[medicine_name] = {
        'dispensed_by': pharmacy_id,
        'timestamp': datetime.now().isoformat()
    }
    
    update_state(f'dispensing_history_{prescription_id}', dispensing_history)
    emit_event('MedicineDispensed', {
        'prescription_id': prescription_id,
        'medicine': medicine_name,
        'pharmacy_id': pharmacy_id
    })
    return True
""",
}


def deploy_default_contracts(self) -> None:
    """Deploy the default prescription-related smart contracts"""
    for contract_name, contract_code in PRESCRIPTION_SMART_CONTRACTS.items():
        self.deploy_contract(contract_name, contract_code)
