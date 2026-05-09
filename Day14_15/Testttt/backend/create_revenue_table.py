import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from django.db import connection

sql = """
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Revenue' AND xtype='U')
BEGIN
    CREATE TABLE Revenue (
        revenue_id    INT IDENTITY PRIMARY KEY,
        payment_id    INT NOT NULL,
        booking_id    INT NOT NULL,
        creator_id    INT NOT NULL,
        total_amount  DECIMAL(12,2) NOT NULL,
        creator_share DECIMAL(12,2) NOT NULL,
        admin_share   DECIMAL(12,2) NOT NULL,
        created_at    DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (payment_id) REFERENCES Payments(payment_id),
        FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
        FOREIGN KEY (creator_id) REFERENCES Users(user_id)
    )
    PRINT 'Table Revenue created successfully.'
END
ELSE
BEGIN
    PRINT 'Table Revenue already exists.'
END
"""

with connection.cursor() as c:
    c.execute(sql)

print("Revenue table setup complete.")
