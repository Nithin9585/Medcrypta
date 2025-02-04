import hashlib
import json
from time import time
from typing import Any, Dict, List


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
        self.validator_identity: str = validator_identity
        self.create_genesis_block()

    def create_genesis_block(self) -> None:
        genesis_block: Block = Block(
            0, time(), {"info": "Genesis Block"}, "0", "Genesis"
        )
        self.chain.append(genesis_block)

    def get_last_block(self) -> Block:
        return self.chain[-1]

    def add_block(self, data: Dict[str, Any], validator: str) -> Block:
        last_block: Block = self.get_last_block()
        new_block: Block = Block(
            index=last_block.index + 1,
            timestamp=time(),
            data=data,
            previous_hash=last_block.hash,
            validator=validator,
        )
        self.chain.append(new_block)
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
