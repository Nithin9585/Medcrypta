import pytest
from datetime import datetime
from app.blockchain.block_chain import SmartContract, PRESCRIPTION_SMART_CONTRACTS


@pytest.fixture
def validator_contract():
    return SmartContract(PRESCRIPTION_SMART_CONTRACTS["PrescriptionValidator"])


@pytest.fixture
def access_contract():
    return SmartContract(PRESCRIPTION_SMART_CONTRACTS["PrescriptionAccess"])


@pytest.fixture
def history_contract():
    return SmartContract(PRESCRIPTION_SMART_CONTRACTS["PrescriptionHistory"])


@pytest.fixture
def dispenser_contract():
    return SmartContract(PRESCRIPTION_SMART_CONTRACTS["MedicineDispenser"])


@pytest.fixture
def valid_prescription():
    return {
        "_id": "123",
        "patient_id": "P001",
        "doctor_id": "D001",
        "medicines": [
            {"name": "Aspirin", "dosage": "100mg"},
            {"name": "Ibuprofen", "dosage": "200mg"},
        ],
        "diagnosis": "Fever",
    }


class TestPrescriptionValidator:
    def test_valid_prescription(self, validator_contract, valid_prescription):
        result = validator_contract.execute("validate_prescription", valid_prescription)
        assert result is True
        assert len(validator_contract.events) == 1
        assert validator_contract.events[0]["name"] == "PrescriptionValidated"

    def test_invalid_prescription_missing_field(self, validator_contract):
        invalid_prescription = {
            "patient_id": "P001",
            "medicines": [],  # Missing doctor_id and diagnosis
        }
        result = validator_contract.execute(
            "validate_prescription", invalid_prescription
        )
        assert result is False
        assert len(validator_contract.events) == 1
        assert validator_contract.events[0]["name"] == "ValidationError"

    def test_invalid_medicines_format(self, validator_contract, valid_prescription):
        invalid_prescription = valid_prescription.copy()
        invalid_prescription["medicines"] = [{"dosage": "100mg"}]  # Missing name
        result = validator_contract.execute(
            "validate_prescription", invalid_prescription
        )
        assert result is False
        assert any(
            event["name"] == "ValidationError" for event in validator_contract.events
        )


class TestPrescriptionAccess:
    def test_patient_access_allowed(self, access_contract, valid_prescription):
        result = access_contract.execute(
            "check_access", "P001", "patient", valid_prescription
        )
        assert result is True
        assert access_contract.events[-1]["name"] == "AccessGranted"

    def test_patient_access_denied(self, access_contract, valid_prescription):
        result = access_contract.execute(
            "check_access", "P002", "patient", valid_prescription
        )
        assert result is False
        assert access_contract.events[-1]["name"] == "AccessDenied"

    def test_doctor_access_allowed(self, access_contract, valid_prescription):
        result = access_contract.execute(
            "check_access", "D001", "doctor", valid_prescription
        )
        assert result is True
        assert access_contract.events[-1]["name"] == "AccessGranted"


class TestPrescriptionHistory:
    def test_record_update(self, history_contract):
        result = history_contract.execute(
            "record_prescription_update", "PRESC_001", "CREATED", "D001"
        )
        assert len(result) == 1
        assert result[0]["type"] == "CREATED"
        assert result[0]["updated_by"] == "D001"
        assert "timestamp" in result[0]
        assert history_contract.events[-1]["name"] == "PrescriptionHistoryUpdated"


class TestMedicineDispenser:
    def test_dispense_medicine_success(self, dispenser_contract):
        result = dispenser_contract.execute(
            "dispense_medicine", "PRESC_001", "PHARM_001", "Aspirin"
        )
        assert result is True
        assert dispenser_contract.events[-1]["name"] == "MedicineDispensed"

    def test_prevent_double_dispensing(self, dispenser_contract):
        # First dispensing
        dispenser_contract.execute(
            "dispense_medicine", "PRESC_001", "PHARM_001", "Aspirin"
        )

        # Try to dispense the same medicine again
        result = dispenser_contract.execute(
            "dispense_medicine", "PRESC_001", "PHARM_001", "Aspirin"
        )
        assert result is False
        assert dispenser_contract.events[-1]["name"] == "DispensingError"
