#!/usr/bin/env python3
"""
Contact Form Viewer - View contact form submissions stored in Redis
"""

import redis
import json
from datetime import datetime

def view_contact_submissions():
    """View all contact form submissions from Redis"""
    try:
        # Connect to Redis
        r = redis.Redis(host='localhost', port=6379, db=0)
        
        # Get all contact form keys
        contact_keys = r.keys("contact_form:*")
        
        if not contact_keys:
            print("No contact form submissions found in Redis.")
            return
        
        print(f"Found {len(contact_keys)} contact form submissions:\n")
        print("=" * 80)
        
        submissions = []
        
        for key in contact_keys:
            # Get the hash data for each key
            contact_data = r.hgetall(key.decode('utf-8'))
            
            # Convert bytes to strings
            submission = {}
            for field, value in contact_data.items():
                submission[field.decode('utf-8')] = value.decode('utf-8')
            
            # Add TTL information
            ttl = r.ttl(key.decode('utf-8'))
            submission['ttl_seconds'] = ttl
            submission['expires_in_days'] = round(ttl / 86400, 1) if ttl > 0 else 0
            submission['redis_key'] = key.decode('utf-8')
            
            submissions.append(submission)
        
        # Sort by timestamp (newest first)
        submissions.sort(key=lambda x: int(x.get('timestamp', 0)), reverse=True)
        
        # Display submissions
        for i, submission in enumerate(submissions, 1):
            print(f"Submission #{i}")
            print(f"Name: {submission.get('name', 'N/A')}")
            print(f"Email: {submission.get('email', 'N/A')}")
            print(f"Phone: {submission.get('phone', 'N/A')}")
            print(f"Service: {submission.get('service', 'N/A')}")
            print(f"Message: {submission.get('message', 'N/A')}")
            print(f"Submitted: {submission.get('submitted_at', 'N/A')}")
            print(f"Expires in: {submission.get('expires_in_days', 0)} days")
            print(f"Redis Key: {submission.get('redis_key', 'N/A')}")
            print("-" * 80)
        
        print(f"\nTotal submissions: {len(submissions)}")
        
    except redis.ConnectionError:
        print("Error: Could not connect to Redis. Make sure Redis is running.")
    except Exception as e:
        print(f"Error: {e}")

def delete_submission(redis_key):
    """Delete a specific contact submission"""
    try:
        r = redis.Redis(host='localhost', port=6379, db=0)
        result = r.delete(redis_key)
        if result:
            print(f"Successfully deleted submission: {redis_key}")
        else:
            print(f"Submission not found: {redis_key}")
    except Exception as e:
        print(f"Error deleting submission: {e}")

def main():
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "delete":
        if len(sys.argv) < 3:
            print("Usage: python contact_viewer.py delete <redis_key>")
            return
        delete_submission(sys.argv[2])
    else:
        view_contact_submissions()

if __name__ == "__main__":
    main()
