#!/usr/bin/env python3
"""
Debug script to understand the Redis rate limiting test issue
"""

import unittest
import json
import hashlib
from unittest.mock import Mock, patch
import fakeredis
from fastapi.testclient import TestClient

# Import the FastAPI app
from main import app

class DebugTest(unittest.TestCase):
    """Debug test case"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.client = TestClient(app)
        self.fake_redis = fakeredis.FakeRedis()
        
        # Sample contact form data
        self.contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "service": "website-monitoring",
            "message": "This is a test message"
        }
    
    @patch('main.redis.Redis')
    def test_debug_redis_keys(self, mock_redis_class):
        """Debug what keys are actually created"""
        # Setup fake redis
        mock_redis_class.return_value = self.fake_redis
        
        # Submit contact form
        print("Submitting contact form...")
        response = self.client.post("/contact", json=self.contact_data)
        print(f"Response status: {response.status_code}")
        
        # Check all keys in fake redis
        all_keys = self.fake_redis.keys("*")
        print(f"All keys in fake redis: {all_keys}")
        
        # Check contact submission keys
        contact_keys = self.fake_redis.keys("contact_submission:*")
        print(f"Contact submission keys: {contact_keys}")
        
        # Check rate limit keys
        rate_limit_keys = self.fake_redis.keys("contact_rate_limit:*")
        print(f"Rate limit keys: {rate_limit_keys}")
        
        # Calculate expected rate limit key
        client_ip = "127.0.0.1"  # TestClient default IP
        user_agent_hash = hashlib.md5("testclient".encode()).hexdigest()
        expected_rate_limit_key = f"contact_rate_limit:{client_ip}:{user_agent_hash}"
        print(f"Expected rate limit key: {expected_rate_limit_key}")
        
        # Check if expected key exists
        exists = self.fake_redis.exists(expected_rate_limit_key)
        print(f"Expected key exists: {exists}")
        
        # Check what the actual user-agent hash should be
        print(f"TestClient user-agent hash: {user_agent_hash}")
        
        # This test should always pass, it's just for debugging
        self.assertTrue(True)

if __name__ == "__main__":
    unittest.main(verbosity=2)
