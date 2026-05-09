import sqlite3
import os

db_path = 'db.sqlite3'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in sqlite:")
    for table in tables:
        print(f"- {table[0]}")
    
    # Check Users table columns if it exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Users';")
    if cursor.fetchone():
        cursor.execute("PRAGMA table_info(Users);")
        print("\nColumns in Users table:")
        for col in cursor.fetchall():
            print(col)
else:
    print("db.sqlite3 not found")
