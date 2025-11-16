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
    from models import Metric, ContactRequest, UserSession, FormMetric
    
    print("Initializing database...")
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created successfully")
        
        # Create sample data for demonstration
        print("Creating sample data...")
        
        # Sample metrics data
        sample_metrics = [
            Metric(
                event_type='page_view',
                page_url='/',
                user_id='user_123',
                session_id='session_abc',
                device_type='desktop',
                browser='Chrome',
                ip_address='192.168.1.1',
                referrer='https://google.com',
                custom_data={'page_title': 'Inicio - HHBC Consultancy'}
            ),
            Metric(
                event_type='page_view',
                page_url='/contacto',
                user_id='user_123',
                session_id='session_abc',
                device_type='desktop',
                browser='Chrome',
                ip_address='192.168.1.1',
                referrer='https://hhbc.com/',
                custom_data={'page_title': 'Contacto - HHBC Consultancy'}
            ),
            Metric(
                event_type='form_submit',
                page_url='/contacto',
                user_id='user_456',
                session_id='session_def',
                device_type='mobile',
                browser='Safari',
                ip_address='192.168.1.2',
                referrer='https://hhbc.com/contacto',
                custom_data={'form_type': 'contact', 'success': True}
            )
        ]
        
        # Sample contact requests
        sample_contacts = [
            ContactRequest(
                name='Juan García',
                email='juan.garcia@email.com',
                phone='+56912345678',
                company='Tech Solutions Ltda.',
                subject='Consultoría en Transformación Digital',
                message='Estoy interesado en servicios de consultoría para la transformación digital de mi empresa. Necesitamos modernizar nuestros procesos y sistemas.',
                status='new',
                ip_address='192.168.1.1',
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                referrer='https://hhbc.com/contacto',
                custom_data={'urgency': 'high', 'budget_range': '$10k-$50k'}
            ),
            ContactRequest(
                name='María Rodríguez',
                email='maria.rodriguez@email.com',
                phone='+56987654321',
                company='Inversiones ABC',
                subject='Análisis de Negocio',
                message='Necesitamos un análisis detallado de nuestro modelo de negocio actual y recomendaciones para optimizarlo.',
                status='in_progress',
                ip_address='192.168.1.3',
                user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                referrer='https://hhbc.com/contacto',
                custom_data={'urgency': 'medium', 'budget_range': '$5k-$20k'}
            )
        ]
        
        # Add sample data to database
        for metric in sample_metrics:
            db.session.add(metric)
        
        for contact in sample_contacts:
            db.session.add(contact)
        
        db.session.commit()
        print("✓ Sample data created successfully")
        
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