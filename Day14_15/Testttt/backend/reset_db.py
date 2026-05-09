import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

with connection.cursor() as cursor:
    # Drop all foreign key constraints
    cursor.execute("""
        DECLARE @sql NVARCHAR(MAX) = N'';
        SELECT @sql += N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
            + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) 
            + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
        FROM sys.foreign_keys;
        EXEC sp_executesql @sql;
    """)
    
    # Drop all tables
    cursor.execute("""
        DECLARE @sql NVARCHAR(MAX) = N'';
        SELECT @sql += N'DROP TABLE ' + QUOTENAME(TABLE_SCHEMA) + '.' + QUOTENAME(TABLE_NAME) + ';'
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE';
        EXEC sp_executesql @sql;
    """)

print("Done resetting database.")
