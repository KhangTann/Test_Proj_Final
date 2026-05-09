import os
import shutil

apps = ['users', 'tours', 'bookings']
for app in apps:
    migrations_dir = os.path.join(app, 'migrations')
    if os.path.exists(migrations_dir):
        print(f"Cleaning {migrations_dir}...")
        for filename in os.listdir(migrations_dir):
            if filename != '__init__.py' and not filename.startswith('__pycache__'):
                file_path = os.path.join(migrations_dir, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
    else:
        print(f"Creating {migrations_dir}...")
        os.makedirs(migrations_dir)
        with open(os.path.join(migrations_dir, '__init__.py'), 'w') as f:
            pass
