import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from users.models import User

def fix_passwords():
    users_to_fix = [
        ('admin1', 'admin1@gmail.com', 'admin123', 'ADMIN'),
        ('user1', 'user1@gmail.com', 'user123', 'USER'),
        ('creator1', 'creator1@gmail.com', 'creator123', 'CREATOR'),
    ]
    
    for username, email, password, role in users_to_fix:
        try:
            user = User.objects.get(username=username)
            user.set_password(password)
            user.role = role
            user.is_staff = (role == 'ADMIN')
            user.is_superuser = (role == 'ADMIN')
            user.save()
            print(f"Updated password for {username} to '{password}'")
        except User.DoesNotExist:
            print(f"User {username} not found, creating...")
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role,
                is_staff=(role == 'ADMIN'),
                is_superuser=(role == 'ADMIN')
            )
            print(f"Created user {username} with password '{password}'")

if __name__ == "__main__":
    fix_passwords()
