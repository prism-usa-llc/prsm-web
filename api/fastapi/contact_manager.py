#!/usr/bin/env python3
"""
Contact Form Management Utility

This script helps view and manage contact form submissions and rate limiting data stored in Redis.
"""

import redis
import json
import sys
from datetime import datetime, timedelta

def connect_redis():
    """Connect to Redis database"""
    try:
        r = redis.Redis(host='localhost', port=6379, db=0)
        r.ping()  # Test connection
        return r
    except redis.ConnectionError:
        print("Error: Could not connect to Redis. Make sure Redis is running.")
        sys.exit(1)

def view_contact_submissions(limit=10):
    """View recent contact form submissions"""
    r = connect_redis()
    
    # Get all contact submission keys
    contact_keys = r.keys("contact_submission:*")
    
    if not contact_keys:
        print("No contact submissions found.")
        return
    
    # Sort keys by timestamp (newest first)
    contact_keys.sort(reverse=True)
    contact_keys = contact_keys[:limit]
    
    print(f"=== Contact Form Submissions (Last {len(contact_keys)}) ===\n")
    
    for i, key in enumerate(contact_keys, 1):
        data = r.get(key)
        ttl = r.ttl(key)
        
        if data:
            submission = json.loads(data.decode('utf-8'))
            
            print(f"{i}. Submission ID: {key.decode('utf-8')}")
            print(f"   Name: {submission.get('name', 'N/A')}")
            print(f"   Email: {submission.get('email', 'N/A')}")
            print(f"   Service: {submission.get('service', 'N/A')}")
            print(f"   Phone: {submission.get('phone', 'N/A')}")
            print(f"   IP Address: {submission.get('ip_address', 'N/A')}")
            print(f"   User Agent: {submission.get('user_agent', 'N/A')[:50]}...")
            print(f"   Message: {submission.get('message', 'N/A')[:100]}...")
            
            if ttl > 0:
                expires_in = str(timedelta(seconds=ttl))
                print(f"   Expires in: {expires_in}")
            else:
                print(f"   Expires in: Already expired or no TTL")
            
            print("-" * 50)

def view_rate_limits():
    """View current rate limiting entries"""
    r = connect_redis()
    
    # Get all rate limit keys
    rate_limit_keys = r.keys("contact_rate_limit:*")
    
    if not rate_limit_keys:
        print("No active rate limits found.")
        return
    
    print(f"=== Active Rate Limits ({len(rate_limit_keys)}) ===\n")
    
    for i, key in enumerate(rate_limit_keys, 1):
        ttl = r.ttl(key)
        key_str = key.decode('utf-8')
        
        # Parse IP from key
        parts = key_str.split(':')
        ip_address = parts[1] if len(parts) > 1 else 'Unknown'
        
        print(f"{i}. Rate Limited IP: {ip_address}")
        print(f"   Redis Key: {key_str}")
        
        if ttl > 0:
            expires_in = str(timedelta(seconds=ttl))
            print(f"   Expires in: {expires_in}")
        else:
            print(f"   Expires in: Already expired")
        
        print("-" * 40)

def clear_rate_limits():
    """Clear all rate limiting entries"""
    r = connect_redis()
    
    rate_limit_keys = r.keys("contact_rate_limit:*")
    
    if not rate_limit_keys:
        print("No rate limits to clear.")
        return
    
    count = r.delete(*rate_limit_keys)
    print(f"Cleared {count} rate limit entries.")

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 contact_manager.py submissions [limit]  - View contact submissions")
        print("  python3 contact_manager.py rate-limits          - View active rate limits")
        print("  python3 contact_manager.py clear-limits         - Clear all rate limits")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "submissions":
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        view_contact_submissions(limit)
    elif command == "rate-limits":
        view_rate_limits()
    elif command == "clear-limits":
        clear_rate_limits()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
