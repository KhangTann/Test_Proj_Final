import os
import django
import sys

# Set encoding to UTF-8 for output
sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from tours.models import Location, Tour

def fix_accents():
    print("Starting database accent correction...")

    # Fix Locations
    locations_to_fix = {
        "Ha Long": "Hạ Long",
        "Da Nang": "Đà Nẵng",
        "Phu Quoc": "Phú Quốc",
        "Hanoi": "Hà Nội",
        "Sapa": "Sa Pa",
    }
    
    for old_name, new_name in locations_to_fix.items():
        locs = Location.objects.filter(name__iexact=old_name)
        for loc in locs:
            print(f"Updating Location: {loc.name} -> {new_name}")
            loc.name = new_name
            loc.save()

    # Fix Tours
    tours = Tour.objects.all()
    for tour in tours:
        original_title = tour.title
        original_desc = tour.description
        
        # fix common typos/missing accents
        new_title = original_title.replace("Khám quá", "Khám phá")
        new_title = new_title.replace("đà nẳng", "Đà Nẵng")
        new_title = new_title.replace("phú quốc", "Phú Quốc")
        new_title = new_title.replace("3d 2y", "3 ngày 2 đêm")
        new_title = new_title.replace("3d 2dem", "3 ngày 2 đêm")
        
        # Capitalize first letter of title if not already
        if new_title and not new_title[0].isupper():
            new_title = new_title[0].upper() + new_title[1:]

        if new_title != original_title:
            print(f"Updating Tour Title: {original_title} -> {new_title}")
            tour.title = new_title
            
        if original_desc:
            new_desc = original_desc.replace("Khám quá", "Khám phá")
            if new_desc != original_desc:
                print(f"Updating Tour Description for: {new_title}")
                tour.description = new_desc
        
        tour.save()

    print("Database accent correction completed.")

if __name__ == "__main__":
    fix_accents()
