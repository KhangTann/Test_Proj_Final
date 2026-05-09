import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from django.db import connection

sql = """
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' and xtype='U')
BEGIN
    CREATE TABLE Reviews (
        review_id INT IDENTITY PRIMARY KEY,
        user_id INT NOT NULL,
        tour_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment NVARCHAR(MAX),
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (tour_id) REFERENCES Tours(tour_id)
    )
END
"""

with connection.cursor() as c:
    c.execute(sql)

print("Table Reviews OK")
