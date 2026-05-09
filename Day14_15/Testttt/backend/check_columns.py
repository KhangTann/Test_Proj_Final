import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

def get_columns(table_name):
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
        return [row[0] for row in cursor.fetchall()]

tables = ['users_user', 'tours_tour', 'tours_tourimage', 'bookings_booking']
for table in tables:
    try:
        cols = get_columns(table)
        print(f"Table {table}: {cols}")
    except Exception as e:
        print(f"Failed to get columns for {table}: {e}")
