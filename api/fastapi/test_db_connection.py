#!/usr/bin/env python3
"""
This script tests the PostgreSQL connection using the DATABASE_URL from the .env file.
"""
import os
import asyncio
import sys
from pathlib import Path
from dotenv import load_dotenv
import asyncpg

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found in .env file")
    sys.exit(1)

# Extract connection parameters from URL
# Format: postgresql+asyncpg://username:password@host:port/database
parts = DATABASE_URL.replace("postgresql+asyncpg://", "").split("@")
user_pass = parts[0].split(":")
host_db = parts[1].split("/")
host_port = host_db[0].split(":")

username = user_pass[0]
password = user_pass[1]
host = host_port[0]
port = int(host_port[1]) if len(host_port) > 1 else 5432
database = host_db[1]

async def test_connection():
    print(f"Testing connection to PostgreSQL at {host}:{port}...")
    print(f"Username: {username}")
    print(f"Database: {database}")
    
    try:
        conn = await asyncpg.connect(
            user=username,
            password=password,
            database=database,
            host=host,
            port=port
        )
        print("Connection successful!")
        
        # Test query
        version = await conn.fetchval("SELECT version();")
        print(f"PostgreSQL version: {version}")
        
        await conn.close()
        return True
    except Exception as e:
        print(f"Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
