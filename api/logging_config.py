import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler

def setup_logging():
    """Setup logging configuration"""
    # Create logs directory if it doesn't exist
    logs_dir = 'logs'
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
    
    # Configure root logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)
    logger.addHandler(console_handler)
    
    # Application log file handler
    app_handler = RotatingFileHandler(
        os.path.join(logs_dir, 'app.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    app_handler.setLevel(logging.INFO)
    app_handler.setFormatter(detailed_formatter)
    logger.addHandler(app_handler)
    
    # Error log file handler
    error_handler = RotatingFileHandler(
        os.path.join(logs_dir, 'error.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(detailed_formatter)
    logger.addHandler(error_handler)
    
    # Security log file handler
    security_handler = RotatingFileHandler(
        os.path.join(logs_dir, 'security.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=10
    )
    security_handler.setLevel(logging.WARNING)
    security_handler.setFormatter(detailed_formatter)
    
    # Create security logger
    security_logger = logging.getLogger('security')
    security_logger.addHandler(security_handler)
    security_logger.setLevel(logging.WARNING)
    
    return logger

class AuditLogger:
    """Audit logging utility for tracking important system events"""
    
    def __init__(self):
        self.logger = logging.getLogger('audit')
        
        # Create audit log handler
        audit_handler = RotatingFileHandler(
            'logs/audit.log',
            maxBytes=50*1024*1024,  # 50MB
            backupCount=10
        )
        audit_handler.setLevel(logging.INFO)
        audit_formatter = logging.Formatter(
            '%(asctime)s - AUDIT - %(message)s'
        )
        audit_handler.setFormatter(audit_formatter)
        self.logger.addHandler(audit_handler)
        self.logger.setLevel(logging.INFO)
    
    def log_contact_form_submission(self, request_id, email, ip_address):
        """Log contact form submission"""
        self.logger.info(f"Contact form submitted - ID: {request_id}, Email: {email}, IP: {ip_address}")
    
    def log_metric_event(self, event_type, user_id, session_id, ip_address):
        """Log metric tracking event"""
        self.logger.info(f"Metric tracked - Type: {event_type}, User: {user_id}, Session: {session_id}, IP: {ip_address}")
    
    def log_admin_action(self, admin_user, action, target_id=None, details=None):
        """Log administrative actions"""
        log_message = f"Admin action - User: {admin_user}, Action: {action}"
        if target_id:
            log_message += f", Target: {target_id}"
        if details:
            log_message += f", Details: {details}"
        
        self.logger.info(log_message)
    
    def log_data_access(self, user, resource, action, ip_address):
        """Log data access events"""
        self.logger.info(f"Data access - User: {user}, Resource: {resource}, Action: {action}, IP: {ip_address}")
    
    def log_security_event(self, event_type, severity, details, ip_address=None):
        """Log security events"""
        security_logger = logging.getLogger('security')
        log_message = f"Security event - Type: {event_type}, Severity: {severity}, Details: {details}"
        if ip_address:
            log_message += f", IP: {ip_address}"
        
        if severity == 'high':
            security_logger.error(log_message)
        else:
            security_logger.warning(log_message)

# Global audit logger instance
audit_logger = AuditLogger()