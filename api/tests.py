import unittest
import json
from datetime import datetime, timedelta
from app import app, db
from models import Metric, ContactRequest, ContactFormMetric
from utils import validate_email, parse_user_agent, FormValidator

class TestBackend(unittest.TestCase):
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['JWT_SECRET_KEY'] = 'test-secret-key'
        
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        
        db.create_all()
        
        # Create test data
        self.test_metric = Metric(
            event_type='page_view',
            page_url='/test',
            user_id='test_user',
            session_id='test_session',
            ip_address='127.0.0.1',
            device_type='desktop'
        )
        
        self.test_contact = ContactRequest(
            id='test-123',
            first_name='John',
            last_name='Doe',
            email='john@example.com',
            subject='Test Subject',
            message='Test message content',
            status='new'
        )
        
        db.session.add(self.test_metric)
        db.session.add(self.test_contact)
        db.session.commit()
    
    def tearDown(self):
        """Clean up after each test method."""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_metric_tracking(self):
        """Test metric tracking endpoint"""
        data = {
            'event_type': 'page_view',
            'page_url': '/home',
            'user_id': 'user123',
            'session_id': 'session123'
        }
        
        response = self.app.post('/api/metrics/track',
                               data=json.dumps(data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.data)
        self.assertTrue(response_data['success'])
        self.assertIn('metric_id', response_data)
    
    def test_contact_form_submission(self):
        """Test contact form submission"""
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com',
            'phone': '+1234567890',
            'company': 'Test Company',
            'subject': 'legal',
            'message': 'This is a test message for legal consultation',
            'session_id': 'session123'
        }
        
        response = self.app.post('/api/contact/submit',
                               data=json.dumps(data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.data)
        self.assertTrue(response_data['success'])
        self.assertIn('request_id', response_data)
    
    def test_invalid_email_validation(self):
        """Test email validation"""
        invalid_emails = ['invalid', 'test@', '@example.com', 'test@example']
        for email in invalid_emails:
            self.assertFalse(validate_email(email))
    
    def test_valid_email_validation(self):
        """Test valid email validation"""
        valid_emails = ['test@example.com', 'user.name@domain.co', 'test+tag@example.org']
        for email in valid_emails:
            self.assertTrue(validate_email(email))
    
    def test_user_agent_parsing(self):
        """Test user agent parsing"""
        test_cases = [
            ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop'),
            ('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'mobile'),
            ('Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', 'tablet')
        ]
        
        for user_agent, expected_device in test_cases:
            result = parse_user_agent(user_agent)
            self.assertEqual(result['device_type'], expected_device)
    
    def test_form_validation(self):
        """Test form validation utilities"""
        validator = FormValidator()
        
        # Test phone validation
        self.assertTrue(validator.validate_phone('+1234567890'))
        self.assertTrue(validator.validate_phone('123-456-7890'))
        self.assertTrue(validator.validate_phone(''))  # Optional field
        self.assertFalse(validator.validate_phone('123'))  # Too short
        
        # Test name validation
        self.assertTrue(validator.validate_name('John Doe'))
        self.assertTrue(validator.validate_name('María José'))
        self.assertFalse(validator.validate_name('J'))  # Too short
        self.assertFalse(validator.validate_name(''))  # Empty
    
    def test_contact_request_status_update(self):
        """Test contact request status update"""
        # First get auth token
        login_data = {'username': 'admin', 'password': 'admin123'}
        auth_response = self.app.post('/api/auth/login',
                                    data=json.dumps(login_data),
                                    content_type='application/json')
        
        self.assertEqual(auth_response.status_code, 200)
        auth_data = json.loads(auth_response.data)
        token = auth_data['access_token']
        
        # Update status
        update_data = {'status': 'in_progress', 'notes': 'Working on it'}
        headers = {'Authorization': f'Bearer {token}'}
        
        response = self.app.put(f'/api/contact/requests/test-123',
                              data=json.dumps(update_data),
                              content_type='application/json',
                              headers=headers)
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['request']['status'], 'in_progress')
        self.assertEqual(response_data['request']['notes'], 'Working on it')

class TestIntegration(unittest.TestCase):
    """Integration tests for the complete system"""
    
    def setUp(self):
        """Set up integration test fixtures"""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        
        db.create_all()
    
    def tearDown(self):
        """Clean up after integration tests"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_complete_contact_flow(self):
        """Test complete contact form flow with metrics"""
        # Track page view
        page_view_data = {
            'event_type': 'page_view',
            'page_url': '/contact',
            'session_id': 'session123',
            'user_id': 'user123'
        }
        
        response = self.app.post('/api/metrics/track',
                               data=json.dumps(page_view_data),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        
        # Submit contact form
        contact_data = {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'subject': 'general',
            'message': 'This is a test message for the contact form',
            'session_id': 'session123',
            'completion_time_seconds': 120,
            'field_interactions': {
                'first_name': True,
                'last_name': True,
                'email': True,
                'subject': True,
                'message': True
            }
        }
        
        response = self.app.post('/api/contact/submit',
                               data=json.dumps(contact_data),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        
        # Verify analytics include the new data
        response = self.app.get('/api/metrics/analytics')
        self.assertEqual(response.status_code, 200)
        
        # Note: This would require authentication in real scenario

if __name__ == '__main__':
    unittest.main()