#!/usr/bin/env python3
"""
Script to create the first admin user for the PRSM system.
Run this after setting up the database to create an initial admin account.
"""

import asyncio
import os
import getpass
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import AsyncSessionLocal, AdminUser
from auth import get_password_hash

async def create_admin_user():
    """Create the first admin user interactively"""
    
    print("=== PRSM Admin User Setup ===")
    print("This script will create the first admin user for your PRSM system.")
    print()
    
    # Get user input
    username = input("Enter admin username: ").strip()
    if not username:
        print("Username cannot be empty!")
        return
    
    email = input("Enter admin email: ").strip()
    if not email or "@" not in email:
        print("Please enter a valid email address!")
        return
    
    password = getpass.getpass("Enter admin password: ")
    if len(password) < 8:
        print("Password must be at least 8 characters long!")
        return
    
    password_confirm = getpass.getpass("Confirm admin password: ")
    if password != password_confirm:
        print("Passwords do not match!")
        return
    
    # Create database session
    async with AsyncSessionLocal() as db:
        try:
            # Check if user already exists
            existing_user = await db.execute(
                select(AdminUser).where(AdminUser.username == username)
            )
            if existing_user.scalar_one_or_none():
                print(f"User '{username}' already exists!")
                return
            
            # Check if email already exists
            existing_email = await db.execute(
                select(AdminUser).where(AdminUser.email == email)
            )
            if existing_email.scalar_one_or_none():
                print(f"Email '{email}' is already registered!")
                return
            
            # Create new admin user
            hashed_password = get_password_hash(password)
            admin_user = AdminUser(
                username=username,
                email=email,
                password_hash=hashed_password,
                role="admin",
                is_active=True
            )
            
            db.add(admin_user)
            await db.commit()
            await db.refresh(admin_user)
            
            print()
            print("✅ Admin user created successfully!")
            print(f"Username: {username}")
            print(f"Email: {email}")
            print(f"Role: admin")
            print()
            print("You can now log in to the admin panel at: /admin")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Error creating admin user: {e}")
            return

async def main():
    """Main function"""
    # Check if database URL is set
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL environment variable is not set!")
        print("Please set it to your PostgreSQL connection string.")
        print("Example: postgresql+asyncpg://user:password@localhost/dbname")
        return
    
    try:
        await create_admin_user()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    asyncio.run(main())