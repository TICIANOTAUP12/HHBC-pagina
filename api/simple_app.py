#!/usr/bin/env python3
"""
Simple Flask backend for HHBC Consultancy - Bypass SQLAlchemy for now
"""
import os
import sys
import json
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import jwt
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-12345')
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DB_PATH = 'consultoria.db'

def init_db():
    """Initialize SQLite database with tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create metrics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            page_url TEXT,
            user_id TEXT,
            session_id TEXT,
            device_type TEXT,
            browser TEXT,
            ip_address TEXT,
            referrer TEXT,
            custom_data TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create contact_requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            custom_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create user_sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            user_id TEXT,
            ip_address TEXT,
            user_agent TEXT,
            device_type TEXT,
            browser TEXT,
            first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully")

def create_sample_data():
    """Create sample data for demonstration"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM metrics")
    if cursor.fetchone()[0] > 0:
        logger.info("Sample data already exists")
        conn.close()
        return
    
    # Insert sample metrics
    sample_metrics = [
        ('page_view', '/', 'user_123', 'session_abc', 'desktop', 'Chrome', '192.168.1.1', 'https://google.com', '{"page_title": "Inicio - HHBC Consultancy"}'),
        ('page_view', '/contacto', 'user_123', 'session_abc', 'desktop', 'Chrome', '192.168.1.1', 'https://hhbc.com/', '{"page_title": "Contacto - HHBC Consultancy"}'),
        ('form_submit', '/contacto', 'user_456', 'session_def', 'mobile', 'Safari', '192.168.1.2', 'https://hhbc.com/contacto', '{"form_type": "contact", "success": true}')
    ]
    
    cursor.executemany('''
        INSERT INTO metrics (event_type, page_url, user_id, session_id, device_type, browser, ip_address, referrer, custom_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_metrics)
    
    # Insert sample contact requests
    sample_contacts = [
        ('Juan García', 'juan.garcia@email.com', '+56912345678', 'Tech Solutions Ltda.', 'Consultoría en Transformación Digital', 'Estoy interesado en servicios de consultoría para la transformación digital de mi empresa. Necesitamos modernizar nuestros procesos y sistemas.', 'new', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://hhbc.com/contacto', '{"urgency": "high", "budget_range": "$10k-$50k"}'),
        ('María Rodríguez', 'maria.rodriguez@email.com', '+56987654321', 'Inversiones ABC', 'Análisis de Negocio', 'Necesitamos un análisis detallado de nuestro modelo de negocio actual y recomendaciones para optimizarlo.', 'in_progress', '192.168.1.3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'https://hhbc.com/contacto', '{"urgency": "medium", "budget_range": "$5k-$20k"}')
    ]
    
    cursor.executemany('''
        INSERT INTO contact_requests (name, email, phone, company, subject, message, status, ip_address, user_agent, referrer, custom_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_contacts)
    
    conn.commit()
    conn.close()
    logger.info("Sample data created successfully")

# Authentication decorator
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # For demo purposes, accept any token that starts with 'demo-token'
            if not token.startswith('demo-token'):
                return jsonify({'error': 'Invalid token'}), 401
                
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

# Routes
@app.route('/')
def index():
    return jsonify({
        'message': 'HHBC Consultancy Backend API',
        'version': '1.0.0',
        'status': 'running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/metrics/track', methods=['POST'])
def track_metric():
    """Track user events and metrics"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('event_type'):
            return jsonify({'error': 'event_type is required'}), 400
        
        # Insert metric into database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO metrics (event_type, page_url, user_id, session_id, device_type, browser, ip_address, referrer, custom_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('event_type'),
            data.get('page_url'),
            data.get('user_id'),
            data.get('session_id'),
            data.get('device_type'),
            data.get('browser'),
            request.remote_addr,
            data.get('referrer'),
            json.dumps(data.get('custom_data', {})) if data.get('custom_data') else None
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Metric tracked: {data.get('event_type')} for user {data.get('user_id')}")
        return jsonify({'message': 'Metric tracked successfully'}), 201
        
    except Exception as e:
        logger.error(f"Error tracking metric: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/metrics/analytics', methods=['GET'])
@require_auth
def get_analytics():
    """Get analytics data"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get metrics summary
        cursor.execute('''
            SELECT 
                COUNT(*) as total_events,
                COUNT(DISTINCT session_id) as unique_sessions,
                COUNT(DISTINCT user_id) as unique_users,
                COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
                COUNT(CASE WHEN event_type = 'form_submit' THEN 1 END) as form_submissions
            FROM metrics
            WHERE timestamp >= datetime('now', '-30 days')
        ''')
        
        summary = cursor.fetchone()
        
        # Get top pages
        cursor.execute('''
            SELECT page_url, COUNT(*) as views
            FROM metrics
            WHERE event_type = 'page_view' AND page_url IS NOT NULL
            GROUP BY page_url
            ORDER BY views DESC
            LIMIT 10
        ''')
        
        top_pages = cursor.fetchall()
        
        # Get device breakdown
        cursor.execute('''
            SELECT device_type, COUNT(*) as count
            FROM metrics
            WHERE device_type IS NOT NULL
            GROUP BY device_type
            ORDER BY count DESC
        ''')
        
        device_breakdown = cursor.fetchall()
        
        conn.close()
        
        return jsonify({
            'summary': {
                'total_events': summary[0] or 0,
                'unique_sessions': summary[1] or 0,
                'unique_users': summary[2] or 0,
                'page_views': summary[3] or 0,
                'form_submissions': summary[4] or 0
            },
            'top_pages': [{'page': page[0], 'views': page[1]} for page in top_pages],
            'device_breakdown': [{'device': device[0], 'count': device[1]} for device in device_breakdown]
        })
        
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/contact/submit', methods=['POST'])
def submit_contact_form():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data.get('email', '')):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Insert contact request into database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contact_requests (name, email, phone, company, subject, message, status, ip_address, user_agent, referrer, custom_data)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
        ''', (
            data.get('name'),
            data.get('email'),
            data.get('phone'),
            data.get('company'),
            data.get('subject'),
            data.get('message'),
            request.remote_addr,
            request.headers.get('User-Agent'),
            request.headers.get('Referer'),
            json.dumps(data.get('custom_data', {})) if data.get('custom_data') else None
        ))
        
        contact_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        logger.info(f"Contact form submitted by {data.get('name')} ({data.get('email')})")
        
        return jsonify({
            'message': 'Contact form submitted successfully',
            'contact_id': contact_id,
            'status': 'new'
        }), 201
        
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/contact/requests', methods=['GET'])
@require_auth
def get_contact_requests():
    """Get all contact requests"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, phone, company, subject, message, status, created_at, updated_at
            FROM contact_requests
            ORDER BY created_at DESC
        ''')
        
        requests = cursor.fetchall()
        conn.close()
        
        contact_requests = []
        for req in requests:
            contact_requests.append({
                'id': req[0],
                'name': req[1],
                'email': req[2],
                'phone': req[3],
                'company': req[4],
                'subject': req[5],
                'message': req[6],
                'status': req[7],
                'created_at': req[8],
                'updated_at': req[9]
            })
        
        return jsonify({'contact_requests': contact_requests})
        
    except Exception as e:
        logger.error(f"Error getting contact requests: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/contact/requests/<int:request_id>/status', methods=['PUT'])
@require_auth
def update_contact_status(request_id):
    """Update contact request status"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'status is required'}), 400
        
        valid_statuses = ['pending', 'in_progress', 'completed']
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE contact_requests 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (new_status, request_id))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Contact request not found'}), 404
        
        conn.commit()
        conn.close()
        
        logger.info(f"Contact request {request_id} status updated to {new_status}")
        return jsonify({'message': 'Status updated successfully'})
        
    except Exception as e:
        logger.error(f"Error updating contact status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting HHBC Consultancy Backend...")
    
    # Initialize database
    init_db()
    create_sample_data()
    
    print("✅ Backend ready!")
    print("📊 API Endpoints:")
    print("   GET  / - API status")
    print("   POST /metrics/track - Track user events")
    print("   GET  /metrics/analytics - Get analytics (Auth: demo-token)")
    print("   POST /contact/submit - Submit contact form")
    print("   GET  /contact/requests - Get contact requests (Auth: demo-token)")
    print("   PUT  /contact/requests/<id>/status - Update status (Auth: demo-token)")
    print("")
    print("🌐 Starting server on http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)