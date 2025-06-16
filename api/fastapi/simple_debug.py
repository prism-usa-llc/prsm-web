#!/usr/bin/env python3
"""
Simple debug script to understand the Redis issue
"""

import json
import hashlib
from unittest.mock import Mock, patch
import fakeredis
from fastapi.testclient import TestClient

# Import the FastAPI app
from main import app

def debug_redis_keys():
    """Debug what keys are actually created"""
    client = TestClient(app)
    fake_redis = fakeredis.FakeRedis()
    
    # Sample contact form data
    contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "555-123-4567",
        "service": "website-monitoring",
        "message": "This is a test message"
    }
    
    # Mock Redis
    with patch('main.redis.Redis') as mock_redis_class:
        mock_redis_class.return_value = fake_redis
        
        # Submit contact form
        print("Submitting contact form...")
        response = client.post("/contact", json=contact_data)
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        # Check all keys in fake redis
        all_keys = fake_redis.keys("*")
        print(f"All keys in fake redis: {all_keys}")
        
        # Check contact submission keys
        contact_keys = fake_redis.keys("contact_submission:*")
        print(f"Contact submission keys: {contact_keys}")
        
        # Check rate limit keys  
        rate_limit_keys = fake_redis.keys("contact_rate_limit:*")
        print(f"Rate limit keys: {rate_limit_keys}")
        
        # Calculate expected rate limit key
        client_ip = "127.0.0.1"  # TestClient default IP
        user_agent_hash = hashlib.md5("testclient".encode()).hexdigest()
        expected_rate_limit_key = f"contact_rate_limit:{client_ip}:{user_agent_hash}"
        print(f"Expected rate limit key: {expected_rate_limit_key}")
        
        # Check if expected key exists
        exists = fake_redis.exists(expected_rate_limit_key)
        print(f"Expected key exists: {exists}")
        
        # Check what the actual user-agent hash should be
        print(f"TestClient user-agent hash: {user_agent_hash}")

if __name__ == "__main__":
    debug_redis_keys()
