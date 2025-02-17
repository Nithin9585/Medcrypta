import pytest
from app.app import app
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_add_block(client):
    access_token = create_access_token(identity="test_user")
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Validator': 'validator'
    }
    response = client.post('/api/blockchain/add_block', json={"data": "test"}, headers=headers)
    assert response.status_code == 201

def test_get_block(client):
    response = client.get('/api/blockchain/get_block/0')
    assert response.status_code == 200

def test_get_chain(client):
    response = client.get('/api/blockchain/get_chain')
    assert response.status_code == 200

def test_get_last_block(client):
    response = client.get('/api/blockchain/get_last_block')
    assert response.status_code == 200

def test_is_chain_valid(client):
    response = client.get('/api/blockchain/is_chain_valid')
    assert response.status_code == 200