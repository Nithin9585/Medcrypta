from app.utils.roles import Doctor, Patient, Pharmacy, User, Validator


role_class_map = {
    "user": User,
    "patient": Patient,
    "doctor": Doctor,
    "pharmacy": Pharmacy,
    "validator": Validator,
}
