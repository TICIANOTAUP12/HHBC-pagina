
# 🚀 HHBC Consultancy - Professional Consulting Website

A modern, professional consulting website built with React and Flask, featuring contact forms, analytics dashboard, and admin panel. Ready for Docker deployment with VPN support.

## 🌟 Features

### Frontend (React + TypeScript)
- ✅ Modern, responsive design
- ✅ Professional consulting theme
- ✅ Contact form with validation
- ✅ Services showcase (Legal, IT, Accounting)
- ✅ Analytics tracking
- ✅ Admin dashboard
- ✅ Mobile-friendly interface

### Backend (Flask + Python)
- ✅ RESTful API with Flask
- ✅ JWT authentication
- ✅ Contact form processing
- ✅ Analytics and metrics tracking
- ✅ PostgreSQL/SQLite database support
- ✅ CORS configuration
- ✅ Production-ready security

### Deployment (Docker)
- ✅ Multi-stage Docker builds
- ✅ Docker Compose orchestration
- ✅ Nginx reverse proxy
- ✅ SSL/HTTPS support
- ✅ VPN deployment ready
- ✅ One-click deployment scripts
- ✅ Health checks and monitoring

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Docker and Docker Compose installed
- Git
- 2GB RAM minimum, 10GB disk space

### One-Click Deployment
```bash
# Clone the repository
git clone https://github.com/yourusername/hhbc-consultancy.git
cd hhbc-consultancy

# Run one-click deployment
./deploy.sh

# Access your application
# Frontend: http://localhost
# Backend API: http://localhost:5000
# Admin Panel: http://localhost/login
```

## 📋 Detailed Deployment Options

### Option 1: Local Development
```bash
# Frontend development
npm install
npm run dev

# Backend development
cd api
pip install -r requirements.txt
python simple_app.py
```

### Option 2: Docker Deployment
```bash
# Configure environment
cp .env.example .env
# Edit .env with your settings

# Deploy with Docker
./docker-deploy.sh start
```

### Option 3: VPN Deployment
```bash
# Configure for VPN
cp .env.vpn.example .env
# Update with your VPN settings

# Deploy with VPN configuration
./deploy.sh
```

## ⚙️ Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Security (CHANGE THESE!)
JWT_SECRET_KEY=your-secure-jwt-key
SECRET_KEY=your-secure-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# URLs
VITE_API_URL=http://localhost:5000
VITE_APP_URL=http://localhost

# Database
DB_PASSWORD=your-secure-db-password
```

### Domain Configuration
For production deployment:
```bash
# Update .env with your domain
VITE_API_URL=https://api.yourdomain.com
VITE_APP_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🔧 Management Commands

```bash
# Service management
./docker-deploy.sh start     # Start all services
./docker-deploy.sh stop      # Stop all services
./docker-deploy.sh restart   # Restart services
./docker-deploy.sh logs      # View logs
./docker-deploy.sh status    # Show service status
./docker-deploy.sh backup    # Backup database

# Testing
./test-docker-deployment.sh  # Run comprehensive tests
```

## 📊 API Endpoints

### Public Endpoints
- `GET /` - API status
- `GET /health` - Health check
- `POST /contact/submit` - Submit contact form
- `POST /metrics/track` - Track analytics

### Authenticated Endpoints
- `POST /auth/login` - Admin login
- `GET /metrics/analytics` - Get analytics data
- `GET /contact/requests` - Get contact requests
- `PUT /contact/requests/{id}/status` - Update request status

## 🛡️ Security Features

### Authentication
- JWT token-based authentication
- Secure password hashing (Werkzeug)
- Token expiration (24 hours)
- Admin user management

### Data Protection
- Environment variable configuration
- No hardcoded credentials in production
- CORS properly configured
- Input validation and sanitization

### Infrastructure
- Non-root Docker containers
- Health checks and monitoring
- SSL/TLS ready
- Security headers (Nginx)

## 📈 Performance

### Resource Requirements
- **CPU**: 1-2 cores minimum
- **RAM**: 2-4 GB recommended
- **Storage**: 10-20 GB
- **Network**: 1 Mbps per concurrent user

### Performance Metrics
- **Frontend Build**: ~35 seconds
- **API Response**: < 500ms typical
- **Database Query**: < 100ms
- **Page Load**: < 2 seconds

## 🔍 Monitoring & Maintenance

### Health Checks
```bash
# API health
curl http://localhost:5000/health

# Service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Backup Strategy
```bash
# Automatic backup (daily)
0 2 * * * /path/to/backup-script.sh

# Manual backup
./docker-deploy.sh backup
```

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change ports in docker-compose.yml |
| Database connection failed | Check PostgreSQL container status |
| Frontend build fails | Clear npm cache, rebuild |
| SSL certificate issues | Renew certificates with certbot |

### Emergency Commands
```bash
# Restart all services
docker-compose restart

# View detailed logs
docker-compose logs --tail=50 backend

# Access container for debugging
docker-compose exec backend bash
```

## 📚 Documentation

- [Docker Deployment Guide](DOCKER_DEPLOYMENT_GUIDE.md) - Complete Docker setup
- [VPN Deployment Guide](VPN_DEPLOYMENT_GUIDE.md) - VPN-specific configuration
- [Deployment Summary](DEPLOYMENT_SUMMARY.md) - Quick reference

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js for the frontend framework
- Flask for the backend API
- Docker for containerization
- Nginx for web server
- PostgreSQL for database

## 📞 Support

For support and questions:
1. Check the documentation files
2. Review the troubleshooting section
3. Check application logs: `docker-compose logs -f`
4. Run tests: `./test-docker-deployment.sh`

---

**🎉 Ready to deploy your professional consultancy website? Start with `./deploy.sh` and you'll be online in minutes!**
  