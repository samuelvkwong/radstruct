"""
Database seeding script
Run this to populate the database with default templates
"""
from app.core.database import SessionLocal
from app.models.models import Template
from app.templates.default_templates import DEFAULT_TEMPLATES


def seed_templates():
    """Seed the database with default radiology templates"""
    db = SessionLocal()
    
    try:
        # Check if templates already exist
        existing_count = db.query(Template).filter(Template.is_public == True).count()
        
        if existing_count > 0:
            print(f"Database already has {existing_count} public templates. Skipping seed.")
            return
        
        # Add default templates
        for template_data in DEFAULT_TEMPLATES:
            template = Template(**template_data)
            db.add(template)
        
        db.commit()
        print(f"Successfully seeded {len(DEFAULT_TEMPLATES)} default templates!")
        
        # Print template names
        for template_data in DEFAULT_TEMPLATES:
            print(f"  - {template_data['name']}")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_templates()
