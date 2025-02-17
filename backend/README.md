# Medical Records Blockchain Backend

A secure and scalable backend system for managing medical records using blockchain technology, built with Flask and MongoDB.

## Features

- 🔐 Role-based authentication (Patient, Doctor, Pharmacy, Validator)
- ⛓️ Blockchain implementation for medical records
- 🏥 Prescription management system
- 📝 Smart contract support
- 🔒 Encrypted data storage
- 🎫 JWT-based authorization
- 📊 Multiple consensus mechanisms (PoW, PoS, PBFT)

## Prerequisites

- Python 3.8+
- MongoDB
- pip (Python package manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Nithin9585/Medcrypta.git
cd Medcrypta
```

1. Create and activate a virtual environment:

```bash
python setup.py
```

1. Set up environment variables:

Create a `.env.development` file with the following variables locally(the variables are in the .env example files):

```bash
MONGO_URI=mongodb://root:example@localhost:27017/
MONGO_DB_NAME=your_database_name
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
JWT_TOKEN_LOCATION=["headers"]
FLASK_ENV=development
```

1. To run the test cases in the code initially run the following command:

```bash
python -m app.utils.make_validator
```

## Project Structure

```tree
backend/
├── app/
│   ├── blockchain/        # Blockchain implementation
│   ├── routes/           # API endpoints
│   ├── utils/            # Utility functions
│   └── app.py           # Main application file
```

## API Endpoints

### Authentication

- `POST /api/register/patient` - Register a new patient
- `POST /api/register` - Register other roles (Doctor, Pharmacy, Validator)
- `POST /api/login` - Common login for all roles

### Blockchain

- `POST /api/blockchain/add_block` - Add a new block
- `GET /api/blockchain/get_block/<index>` - Get block by index
- `GET /api/blockchain/get_chain` - Get entire blockchain
- `GET /api/blockchain/is_chain_valid` - Verify blockchain integrity

### Prescriptions

- `POST /api/prescriptions` - Create new prescription
- `GET /api/prescriptions` - Get all prescriptions (Doctor only)
- `GET /api/prescriptions/<patient_id>` - Get patient prescriptions

## Running Tests

```bash
pytest app/utils/test_blockchain.py
pytest test/latest_api_test.py
```

## Security Features

- Password encryption using Fernet
- JWT-based authentication
- Role-based access control
- Blockchain data integrity
- MongoDB secure connection

## Development

To run the application in development mode:

```bash
flask run
```

## Logging

Logs are stored in the `logs` directory. The application uses JSON formatting for logs with rotation enabled.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
