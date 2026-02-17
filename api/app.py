from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime
import os
from dotenv import load_dotenv
from models import db

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///consultoria.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
cors = CORS(app)
jwt = JWTManager(app)

# Import models
from models import *

# Import and register routes
from routes import api
app.register_blueprint(api)

# Simple health check route
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "HHBC Consultancy API is running"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)