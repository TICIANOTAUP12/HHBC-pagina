from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from models import Metric, ContactRequest, ContactFormMetric, UserSession
from app import db
from datetime import datetime, timedelta
import uuid
import logging
from utils import get_client_ip, parse_user_agent, validate_email

api = Blueprint('api', __name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Metrics endpoints
@api.route('/metrics/track', methods=['POST'])
def track_metric():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('event_type'):
            return jsonify({'error': 'event_type is required'}), 400
        
        # Create metric
        metric = Metric(
            event_type=data['event_type'],
            page_url=data.get('page_url'),
            user_id=data.get('user_id'),
            session_id=data.get('session_id'),
            ip_address=get_client_ip(request),
            user_agent=request.headers.get('User-Agent'),
            referrer=data.get('referrer'),
            country=data.get('country'),
            device_type=data.get('device_type'),
            additional_data=data.get('additional_data')
        )
        
        db.session.add(metric)
        db.session.commit()
        
        logger.info(f"Metric tracked: {data['event_type']} - {data.get('page_url', 'N/A')}")
        
        return jsonify({
            'success': True,
            'metric_id': metric.id,
            'message': 'Metric tracked successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error tracking metric: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/metrics/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        # Get query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        event_type = request.args.get('event_type')
        
        # Build query
        query = Metric.query
        
        if start_date:
            query = query.filter(Metric.timestamp >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(Metric.timestamp <= datetime.fromisoformat(end_date))
        if event_type:
            query = query.filter(Metric.event_type == event_type)
        
        # Get metrics
        metrics = query.all()
        
        # Calculate analytics
        analytics = {
            'total_events': len(metrics),
            'events_by_type': {},
            'page_views': {},
            'unique_sessions': set(),
            'unique_users': set(),
            'device_breakdown': {},
            'country_breakdown': {}
        }
        
        for metric in metrics:
            # Events by type
            analytics['events_by_type'][metric.event_type] = analytics['events_by_type'].get(metric.event_type, 0) + 1
            
            # Page views
            if metric.page_url:
                analytics['page_views'][metric.page_url] = analytics['page_views'].get(metric.page_url, 0) + 1
            
            # Unique sessions and users
            if metric.session_id:
                analytics['unique_sessions'].add(metric.session_id)
            if metric.user_id:
                analytics['unique_users'].add(metric.user_id)
            
            # Device breakdown
            if metric.device_type:
                analytics['device_breakdown'][metric.device_type] = analytics['device_breakdown'].get(metric.device_type, 0) + 1
            
            # Country breakdown
            if metric.country:
                analytics['country_breakdown'][metric.country] = analytics['country_breakdown'].get(metric.country, 0) + 1
        
        # Convert sets to counts
        analytics['unique_sessions'] = len(analytics['unique_sessions'])
        analytics['unique_users'] = len(analytics['unique_users'])
        
        return jsonify(analytics), 200
        
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Contact form endpoints
@api.route('/contact/submit', methods=['POST'])
def submit_contact_form():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Create contact request
        contact_request = ContactRequest(
            first_name=data['first_name'].strip(),
            last_name=data['last_name'].strip(),
            email=data['email'].strip().lower(),
            phone=data.get('phone', '').strip(),
            company=data.get('company', '').strip(),
            subject=data['subject'],
            message=data['message'].strip(),
            priority='high' if data.get('urgent') else 'medium',
            source='website'
        )
        
        db.session.add(contact_request)
        db.session.commit()
        
        # Track form submission metric
        form_metric = ContactFormMetric(
            form_id=contact_request.id,
            completion_time_seconds=data.get('completion_time_seconds'),
            field_interactions=data.get('field_interactions'),
            conversion_rate_data=data.get('conversion_data'),
            abandonment_point=data.get('abandonment_point')
        )
        
        db.session.add(form_metric)
        db.session.commit()
        
        # Track general metric for form submission
        track_metric_internal('contact_form_submit', {
            'page_url': data.get('current_page'),
            'session_id': data.get('session_id'),
            'user_id': data.get('user_id'),
            'additional_data': {
                'form_id': contact_request.id,
                'subject': contact_request.subject,
                'priority': contact_request.priority
            }
        })
        
        logger.info(f"Contact form submitted: {contact_request.id} - {contact_request.email}")
        
        return jsonify({
            'success': True,
            'request_id': contact_request.id,
            'message': 'Contact form submitted successfully. We will respond within 24 hours.'
        }), 201
        
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/contact/requests', methods=['GET'])
@jwt_required()
def get_contact_requests():
    try:
        # Get query parameters
        status = request.args.get('status')
        priority = request.args.get('priority')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Build query
        query = ContactRequest.query
        
        if status:
            query = query.filter(ContactRequest.status == status)
        if priority:
            query = query.filter(ContactRequest.priority == priority)
        if start_date:
            query = query.filter(ContactRequest.created_at >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(ContactRequest.created_at <= datetime.fromisoformat(end_date))
        
        # Get requests ordered by created date (newest first)
        requests = query.order_by(ContactRequest.created_at.desc()).all()
        
        return jsonify({
            'requests': [req.to_dict() for req in requests],
            'total': len(requests)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting contact requests: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/contact/requests/<string:request_id>', methods=['GET'])
@jwt_required()
def get_contact_request(request_id):
    try:
        request_obj = ContactRequest.query.get_or_404(request_id)
        return jsonify(request_obj.to_dict()), 200
        
    except Exception as e:
        logger.error(f"Error getting contact request: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/contact/requests/<string:request_id>/status', methods=['PUT'])
@jwt_required()
def update_request_status(request_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        notes = data.get('notes')
        
        if not new_status:
            return jsonify({'error': 'status is required'}), 400
        
        valid_statuses = ['new', 'in_progress', 'resolved', 'closed']
        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        request_obj = ContactRequest.query.get_or_404(request_id)
        old_status = request_obj.status
        request_obj.status = new_status
        
        if notes:
            request_obj.notes = notes
        
        if new_status == 'resolved' and old_status != 'resolved':
            request_obj.responded_at = datetime.utcnow()
        
        db.session.commit()
        
        logger.info(f"Contact request status updated: {request_id} - {old_status} -> {new_status}")
        
        return jsonify({
            'success': True,
            'message': 'Status updated successfully',
            'request': request_obj.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating request status: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Authentication endpoints
@api.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Simple authentication (replace with proper user management)
        if username == os.getenv('ADMIN_USERNAME', 'admin') and password == os.getenv('ADMIN_PASSWORD', 'admin123'):
            access_token = create_access_token(identity=username, expires_delta=timedelta(hours=24))
            return jsonify({
                'success': True,
                'access_token': access_token,
                'user': {'username': username}
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Helper function to track metrics internally
def track_metric_internal(event_type, data):
    try:
        metric = Metric(
            event_type=event_type,
            page_url=data.get('page_url'),
            user_id=data.get('user_id'),
            session_id=data.get('session_id'),
            additional_data=data.get('additional_data')
        )
        db.session.add(metric)
        db.session.commit()
    except Exception as e:
        logger.error(f"Error tracking internal metric: {str(e)}")
        db.session.rollback()