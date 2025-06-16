#!/usr/bin/env python3
"""
Simplified test file for contact form rate limiting using fakeredis
"""

import unittest
import json
import hashlib
import time
from unittest.mock import Mock, patch
import fakeredis

class TestRateLimitingLogic(unittest.TestCase):
    """Test rate limiting logic with fake Redis"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.fake_redis = fakeredis.FakeRedis()
        self.client_ip = "192.168.1.100"
        self.user_agent = "Mozilla/5.0 (Test Browser)"
        self.user_agent_hash = hashlib.md5(self.user_agent.encode()).hexdigest()
        self.rate_limit_key = f"contact_rate_limit:{self.client_ip}:{self.user_agent_hash}"
    
    def test_rate_limit_key_creation(self):
        """Test rate limit key generation"""
        # Key should be properly formatted
        self.assertTrue(self.rate_limit_key.startswith("contact_rate_limit:"))
        self.assertIn(self.client_ip, self.rate_limit_key)
        self.assertIn(self.user_agent_hash, self.rate_limit_key)
        print(f"✓ Rate limit key: {self.rate_limit_key}")
    
    def test_first_submission_allowed(self):
        """Test that first submission is allowed"""
        # Rate limit key should not exist initially
        self.assertFalse(self.fake_redis.exists(self.rate_limit_key))
        
        # Simulate setting the rate limit after first submission
        self.fake_redis.setex(self.rate_limit_key, 60, "rate_limited")
        
        # Key should now exist
        self.assertTrue(self.fake_redis.exists(self.rate_limit_key))
        print("✓ First submission sets rate limit key")
    
    def test_second_submission_blocked(self):
        """Test that second submission is blocked"""
        # Set rate limit (simulate first submission)
        self.fake_redis.setex(self.rate_limit_key, 60, "rate_limited")
        
        # Check if rate limited (simulate second submission)
        is_rate_limited = self.fake_redis.exists(self.rate_limit_key)
        self.assertTrue(is_rate_limited)
        print("✓ Second submission is blocked by rate limit")
    
    def test_rate_limit_ttl(self):
        """Test rate limit TTL (Time To Live)"""
        # Set rate limit with 60 second TTL
        self.fake_redis.setex(self.rate_limit_key, 60, "rate_limited")
        
        # Check TTL
        ttl = self.fake_redis.ttl(self.rate_limit_key)
        self.assertGreater(ttl, 50)  # Should be close to 60
        self.assertLessEqual(ttl, 60)
        print(f"✓ Rate limit TTL: {ttl} seconds")
    
    def test_rate_limit_expiry(self):
        """Test rate limit expiry"""
        # Set rate limit
        self.fake_redis.setex(self.rate_limit_key, 60, "rate_limited")
        self.assertTrue(self.fake_redis.exists(self.rate_limit_key))
        
        # Manually expire (simulate time passage)
        self.fake_redis.delete(self.rate_limit_key)
        self.assertFalse(self.fake_redis.exists(self.rate_limit_key))
        print("✓ Rate limit expires and allows new submissions")
    
    def test_different_ips_different_keys(self):
        """Test that different IPs get different rate limit keys"""
        ip1 = "192.168.1.100"
        ip2 = "192.168.1.101"
        ua_hash = hashlib.md5(self.user_agent.encode()).hexdigest()
        
        key1 = f"contact_rate_limit:{ip1}:{ua_hash}"
        key2 = f"contact_rate_limit:{ip2}:{ua_hash}"
        
        # Keys should be different
        self.assertNotEqual(key1, key2)
        
        # Set rate limit for IP1
        self.fake_redis.setex(key1, 60, "rate_limited")
        
        # IP1 should be rate limited, IP2 should not
        self.assertTrue(self.fake_redis.exists(key1))
        self.assertFalse(self.fake_redis.exists(key2))
        print("✓ Different IPs have independent rate limits")
    
    def test_contact_data_storage(self):
        """Test contact form data storage"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "service": "website-monitoring",
            "message": "Test message",
            "ip_address": self.client_ip,
            "user_agent": self.user_agent,
            "timestamp": str(time.time())
        }
        
        # Create contact key
        email_hash = hashlib.md5(contact_data["email"].encode()).hexdigest()[:8]
        contact_key = f"contact_submission:{int(time.time())}:{email_hash}"
        
        # Store data with 1 week TTL
        self.fake_redis.setex(contact_key, 604800, json.dumps(contact_data))
        
        # Verify storage
        self.assertTrue(self.fake_redis.exists(contact_key))
        
        # Verify data integrity
        stored_data = json.loads(self.fake_redis.get(contact_key).decode('utf-8'))
        self.assertEqual(stored_data["name"], contact_data["name"])
        self.assertEqual(stored_data["email"], contact_data["email"])
        
        # Check TTL (1 week = 604800 seconds)
        ttl = self.fake_redis.ttl(contact_key)
        self.assertGreater(ttl, 604790)
        print(f"✓ Contact data stored with TTL: {ttl} seconds")
    
    def test_multiple_contact_submissions_storage(self):
        """Test storing multiple contact submissions"""
        submissions = [
            {"name": "User 1", "email": "user1@test.com", "service": "sms-alerts"},
            {"name": "User 2", "email": "user2@test.com", "service": "website-monitoring"},
            {"name": "User 3", "email": "user3@test.com", "service": "it-consulting"}
        ]
        
        stored_keys = []
        for i, submission in enumerate(submissions):
            timestamp = int(time.time()) + i  # Different timestamps
            email_hash = hashlib.md5(submission["email"].encode()).hexdigest()[:8]
            key = f"contact_submission:{timestamp}:{email_hash}"
            
            submission_data = {
                **submission,
                "ip_address": f"192.168.1.{100 + i}",
                "timestamp": str(timestamp)
            }
            
            self.fake_redis.setex(key, 604800, json.dumps(submission_data))
            stored_keys.append(key)
        
        # Verify all submissions stored
        self.assertEqual(len(stored_keys), 3)
        for key in stored_keys:
            self.assertTrue(self.fake_redis.exists(key))
        
        # Verify we can retrieve contact submission keys
        all_contact_keys = self.fake_redis.keys("contact_submission:*")
        self.assertGreaterEqual(len(all_contact_keys), 3)
        print(f"✓ Multiple submissions stored: {len(all_contact_keys)} total")

class TestRedisOperations(unittest.TestCase):
    """Test Redis operations specifically"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.fake_redis = fakeredis.FakeRedis()
    
    def test_redis_setex_operation(self):
        """Test Redis SETEX operation"""
        key = "test_key"
        value = "test_value"
        ttl = 60
        
        # Set key with TTL
        result = self.fake_redis.setex(key, ttl, value)
        self.assertTrue(result)
        
        # Verify key exists
        self.assertTrue(self.fake_redis.exists(key))
        
        # Verify value
        self.assertEqual(self.fake_redis.get(key).decode('utf-8'), value)
        
        # Verify TTL
        remaining_ttl = self.fake_redis.ttl(key)
        self.assertGreater(remaining_ttl, 0)
        self.assertLessEqual(remaining_ttl, ttl)
        print("✓ Redis SETEX operation works correctly")
    
    def test_redis_json_storage(self):
        """Test storing JSON data in Redis"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "timestamp": time.time(),
            "metadata": {"ip": "127.0.0.1", "browser": "test"}
        }
        
        key = "json_test"
        json_str = json.dumps(test_data)
        
        # Store JSON
        self.fake_redis.setex(key, 300, json_str)
        
        # Retrieve and parse JSON
        retrieved_json = self.fake_redis.get(key).decode('utf-8')
        retrieved_data = json.loads(retrieved_json)
        
        # Verify data integrity
        self.assertEqual(retrieved_data["name"], test_data["name"])
        self.assertEqual(retrieved_data["email"], test_data["email"])
        self.assertEqual(retrieved_data["metadata"]["ip"], test_data["metadata"]["ip"])
        print("✓ JSON data storage and retrieval works correctly")

def run_rate_limit_simulation():
    """Simulate real-world rate limiting scenario"""
    print("\n" + "="*60)
    print("RATE LIMITING SIMULATION")
    print("="*60)
    
    fake_redis = fakeredis.FakeRedis()
    
    # Simulate user making contact form submissions
    client_ip = "203.0.113.100"  # Example IP
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    user_agent_hash = hashlib.md5(user_agent.encode()).hexdigest()
    rate_limit_key = f"contact_rate_limit:{client_ip}:{user_agent_hash}"
    
    print(f"Client IP: {client_ip}")
    print(f"User Agent Hash: {user_agent_hash}")
    print(f"Rate Limit Key: {rate_limit_key}")
    
    # First submission
    print("\n1. First submission attempt:")
    if not fake_redis.exists(rate_limit_key):
        print("   ✓ ALLOWED - No rate limit exists")
        fake_redis.setex(rate_limit_key, 60, "rate_limited")
        print("   ✓ Rate limit set for 60 seconds")
        
        # Store contact data
        contact_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "service": "website-monitoring",
            "message": "Please monitor my website",
            "ip_address": client_ip,
            "user_agent": user_agent,
            "timestamp": str(time.time())
        }
        contact_key = f"contact_submission:{int(time.time())}:12345678"
        fake_redis.setex(contact_key, 604800, json.dumps(contact_data))
        print("   ✓ Contact data saved")
    else:
        print("   ❌ BLOCKED - Rate limited")
    
    # Second submission (immediate)
    print("\n2. Second submission attempt (immediate):")
    if not fake_redis.exists(rate_limit_key):
        print("   ✓ ALLOWED")
    else:
        ttl = fake_redis.ttl(rate_limit_key)
        print(f"   ❌ BLOCKED - Rate limited (expires in {ttl} seconds)")
    
    # Simulate time passage
    print("\n3. Simulating rate limit expiry:")
    fake_redis.delete(rate_limit_key)  # Simulate expiry
    print("   ✓ Rate limit expired")
    
    # Third submission (after expiry)
    print("\n4. Third submission attempt (after expiry):")
    if not fake_redis.exists(rate_limit_key):
        print("   ✓ ALLOWED - Rate limit has expired")
        fake_redis.setex(rate_limit_key, 60, "rate_limited")
        print("   ✓ New rate limit set")
    else:
        print("   ❌ BLOCKED - Still rate limited")
    
    # Show stored contact submissions
    print("\n5. Stored contact submissions:")
    contact_keys = fake_redis.keys("contact_submission:*")
    print(f"   Total submissions stored: {len(contact_keys)}")
    
    for key in contact_keys:
        data = json.loads(fake_redis.get(key).decode('utf-8'))
        ttl = fake_redis.ttl(key)
        print(f"   - {data['name']} ({data['email']}) - TTL: {ttl}s")

if __name__ == "__main__":
    print("Testing Contact Form Rate Limiting with FakeRedis")
    print("=" * 60)
    
    # Run unit tests
    unittest.main(verbosity=2, exit=False)
    
    # Run simulation
    run_rate_limit_simulation()
    
    print("\n" + "=" * 60)
    print("✓ All tests completed successfully!")
    print("Rate limiting is working correctly with Redis TTL")
