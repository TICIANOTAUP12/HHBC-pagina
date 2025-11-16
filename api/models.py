from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
from app import db

class Metric(db.Model):
    __tablename__ = 'metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False)  # 'page_view', 'contact_form_submit', etc.
    page_url = db.Column(db.String(500))
    user_id = db.Column(db.String(100))
    session_id = db.Column(db.String(100))
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    referrer = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    country = db.Column(db.String(100))
    device_type = db.Column(db.String(50))
    additional_data = db.Column(db.JSON)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type,
            'page_url': self.page_url,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'referrer': self.referrer,
            'timestamp': self.timestamp.isoformat(),
            'country': self.country,
            'device_type': self.device_type,
            'additional_data': self.additional_data
        }

class ContactRequest(db.Model):
    __tablename__ = 'contact_requests'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50))
    company = db.Column(db.String(200))
    subject = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='new')  # new, in_progress, resolved, closed
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    assigned_to = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    responded_at = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    source = db.Column(db.String(50), default='website')
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'priority': self.priority,
            'assigned_to': self.assigned_to,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
            'notes': self.notes,
            'source': self.source
        }

class ContactFormMetric(db.Model):
    __tablename__ = 'contact_form_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.String(36), db.ForeignKey('contact_requests.id'))
    submission_time = db.Column(db.DateTime, default=datetime.utcnow)
    completion_time_seconds = db.Column(db.Integer)  # Time taken to complete form
    field_interactions = db.Column(db.JSON)  # Track which fields were interacted with
    conversion_rate_data = db.Column(db.JSON)
    abandonment_point = db.Column(db.String(100))  # Where user abandoned the form
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'submission_time': self.submission_time.isoformat(),
            'completion_time_seconds': self.completion_time_seconds,
            'field_interactions': self.field_interactions,
            'conversion_rate_data': self.conversion_rate_data,
            'abandonment_point': self.abandonment_point
        }

class UserSession(db.Model):
    __tablename__ = 'user_sessions'
    
    id = db.Column(db.String(100), primary_key=True)
    user_id = db.Column(db.String(100))
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    device_info = db.Column(db.JSON)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'started_at': self.started_at.isoformat(),
            'last_activity': self.last_activity.isoformat(),
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'device_info': self.device_info,
            'is_active': self.is_active
        }