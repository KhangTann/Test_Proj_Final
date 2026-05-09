import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from django.db import connection

sql = """
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OTPRecords' and xtype='U')
BEGIN
    CREATE TABLE OTPRecords (
        id INT IDENTITY PRIMARY KEY,
        user_id INT not null,
        otp NVARCHAR(6) not null,
        created_at DATETIME DEFAULT GETDATE(),
        is_used BIT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    )
END
"""

with connection.cursor() as c:
    c.execute(sql)

print("OTPRecords OK")
