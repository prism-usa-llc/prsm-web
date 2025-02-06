#!/usr/bin/env python3

import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('customers.db')

# Create a cursor object
cursor = conn.cursor()

# Create a table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        business_name TEXT,
        fname TEXT,
        lname TEXT,
        email TEXT,
        phone TEXT
    )
''')

# Insert data into the table
cursor.execute('''
    INSERT INTO users (business_name, fname, lname, email, phone ) VALUES
    ('prsmusa.com', 'raymond', 'mintz', 'raymondmintz11@gmail.com', '6265131204'),
    ('prsmusa.com', 'fakefname', 'fakelname', 'ray@prsmusa.com', '6265131204' )
''')

# Commit the changes
conn.commit()

# Query data from the table
cursor.execute('SELECT * FROM users')
rows = cursor.fetchall()

# Print the data
for row in rows:
    print(row)

# Close the connection
conn.close()
