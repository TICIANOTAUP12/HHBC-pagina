#!/usr/bin/env python3
"""
Initialize the database for the HHBC Consultancy Backend
"""
import os
import sys
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db
    from models import Metric, ContactRequest, UserSession, ContactFormMetric
    
    print("Initializing database...")
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created successfully")
        
        # Skip sample data creation for now - can be added later if needed
        print("✓ Database initialized (no sample data)")
        
        # Show database statistics
        metrics_count = Metric.query.count()
        contacts_count = ContactRequest.query.count()
        sessions_count = UserSession.query.count()
        
        print(f"\n📊 Database Statistics:")
        print(f"   Metrics: {metrics_count}")
        print(f"   Contact Requests: {contacts_count}")
        print(f"   User Sessions: {sessions_count}")
        
        print("\n✅ Database initialization completed successfully!")
        
except Exception as e:
    print(f"❌ Error initializing database: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)