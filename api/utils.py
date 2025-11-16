import re
import logging
from flask import request

logger = logging.getLogger(__name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def get_client_ip(request_obj):
    """Get client IP address from request"""
    if request_obj.headers.get('X-Forwarded-For'):
        return request_obj.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request_obj.headers.get('X-Real-IP'):
        return request_obj.headers.get('X-Real-IP')
    else:
        return request_obj.remote_addr

def parse_user_agent(user_agent_string):
    """Parse user agent string to extract device info"""
    if not user_agent_string:
        return {}
    
    device_info = {
        'device_type': 'unknown',
        'browser': 'unknown',
        'os': 'unknown'
    }
    
    user_agent_lower = user_agent_string.lower()
    
    # Device type detection
    if 'mobile' in user_agent_lower:
        device_info['device_type'] = 'mobile'
    elif 'tablet' in user_agent_lower or 'ipad' in user_agent_lower:
        device_info['device_type'] = 'tablet'
    elif 'bot' in user_agent_lower or 'crawler' in user_agent_lower:
        device_info['device_type'] = 'bot'
    else:
        device_info['device_type'] = 'desktop'
    
    # Browser detection
    if 'chrome' in user_agent_lower and 'edg' not in user_agent_lower:
        device_info['browser'] = 'chrome'
    elif 'firefox' in user_agent_lower:
        device_info['browser'] = 'firefox'
    elif 'safari' in user_agent_lower and 'chrome' not in user_agent_lower:
        device_info['browser'] = 'safari'
    elif 'edg' in user_agent_lower:
        device_info['browser'] = 'edge'
    elif 'opera' in user_agent_lower:
        device_info['browser'] = 'opera'
    
    # OS detection
    if 'windows' in user_agent_lower:
        device_info['os'] = 'windows'
    elif 'macintosh' in user_agent_lower or 'mac os' in user_agent_lower:
        device_info['os'] = 'macos'
    elif 'linux' in user_agent_lower:
        device_info['os'] = 'linux'
    elif 'android' in user_agent_lower:
        device_info['os'] = 'android'
    elif 'iphone' in user_agent_lower or 'ipad' in user_agent_lower:
        device_info['os'] = 'ios'
    
    return device_info

def sanitize_input(input_string, max_length=500):
    """Sanitize user input to prevent XSS and SQL injection"""
    if not input_string:
        return ""
    
    # Remove leading/trailing whitespace
    sanitized = input_string.strip()
    
    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&']
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    return sanitized

def generate_request_id():
    """Generate unique request ID"""
    import uuid
    return str(uuid.uuid4())

def calculate_conversion_rate(total_visitors, conversions):
    """Calculate conversion rate percentage"""
    if total_visitors == 0:
        return 0.0
    return round((conversions / total_visitors) * 100, 2)

def format_timestamp(dt):
    """Format datetime object to ISO string"""
    if not dt:
        return None
    return dt.isoformat()

def log_security_event(event_type, details, request_obj=None):
    """Log security events for audit trail"""
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,
        'details': details,
        'ip_address': get_client_ip(request_obj) if request_obj else None,
        'user_agent': request_obj.headers.get('User-Agent') if request_obj else None
    }
    
    logger.warning(f"Security Event: {event_type} - {details}", extra=log_entry)

def is_rate_limited(ip_address, action_type, limit=10, window_minutes=60):
    """Check if IP address is rate limited for specific action"""
    from datetime import datetime, timedelta
    from app import db
    from models import Metric
    
    window_start = datetime.utcnow() - timedelta(minutes=window_minutes)
    
    count = Metric.query.filter(
        Metric.ip_address == ip_address,
        Metric.event_type == action_type,
        Metric.timestamp >= window_start
    ).count()
    
    return count >= limit

class FormValidator:
    """Utility class for form validation"""
    
    @staticmethod
    def validate_phone(phone):
        """Validate phone number format (basic validation)"""
        if not phone:
            return True  # Phone is optional
        
        # Remove common formatting characters
        cleaned_phone = re.sub(r'[\s\-\(\)\+]', '', phone)
        
        # Check if it contains only digits and is reasonable length
        return cleaned_phone.isdigit() and 8 <= len(cleaned_phone) <= 15
    
    @staticmethod
    def validate_name(name):
        """Validate name format"""
        if not name or len(name.strip()) < 2:
            return False
        
        # Allow letters, spaces, hyphens, and common accents
        name_pattern = r"^[a-zA-ZÀ-ÿ\s\-\']+$"
        return re.match(name_pattern, name.strip()) is not None
    
    @staticmethod
    def validate_message(message, min_length=10, max_length=5000):
        """Validate message content"""
        if not message:
            return False
        
        message = message.strip()
        if len(message) < min_length or len(message) > max_length:
            return False
        
        return True