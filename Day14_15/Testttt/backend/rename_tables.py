import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

renames = [
    ('users_user', 'Users'),
    ('tours_tour', 'Tours'),
    ('tours_tourimage', 'TourImages'),
    ('bookings_booking', 'Bookings'),
    ('tours_location', 'Locations'), # I'll check if this exists
    ('tours_review', 'Reviews'),
]

with connection.cursor() as cursor:
    for old_name, new_name in renames:
        try:
            # Check if old table exists
            cursor.execute(f"SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{old_name}'")
            if cursor.fetchone():
                print(f"Renaming {old_name} to {new_name}...")
                cursor.execute(f"EXEC sp_rename '{old_name}', '{new_name}'")
            else:
                print(f"Table {old_name} not found, skipping.")
        except Exception as e:
            print(f"Failed to rename {old_name}: {e}")

print("Done.")
