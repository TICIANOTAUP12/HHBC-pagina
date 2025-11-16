# 🚀 HHBC CONSULTANCY - DOCKER DEPLOYMENT GUIDE

## 📋 QUICK START (5 minutes)

### 1. **Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings (IMPORTANT: Change default passwords!)
nano .env
```

### 2. **Deploy with Docker**
```bash
# Make script executable (Linux/Mac)
chmod +x docker-deploy.sh

# Run deployment
./docker-deploy.sh start

# Or on Windows
docker-deploy.bat start
```

### 3. **Access Your Application**
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

---

## 🐳 DOCKER SERVICES

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Nginx) | 80 | React application |
| Backend (Flask) | 5000 | API server |
| PostgreSQL | 5432 | Database (optional) |

---

## ⚙️ CONFIGURATION

### **Environment Variables (.env)**

```bash
# REQUIRED: Database
DB_PASSWORD=your_secure_database_password_here

# REQUIRED: Security Keys (Generate strong random keys!)
JWT_SECRET_KEY=your-super-secure-jwt-key-minimum-32-characters-long
SECRET_KEY=your-super-secure-secret-key-minimum-32-characters-long

# REQUIRED: Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password_min_12_chars

# REQUIRED: URLs
VITE_API_URL=http://localhost:5000
VITE_APP_URL=http://localhost

# OPTIONAL: CORS (for production)
CORS_ORIGINS=http://localhost:3000,http://frontend:80,https://yourdomain.com
```

### **Generate Secure Keys**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
```

---

## 🔧 MANAGEMENT COMMANDS

### **Using the Deployment Script**
```bash
# Interactive menu
./docker-deploy.sh

# Direct commands
./docker-deploy.sh start     # Start all services
./docker-deploy.sh stop      # Stop all services
./docker-deploy.sh restart   # Restart services
./docker-deploy.sh logs      # View logs
./docker-deploy.sh status    # Show service status
./docker-deploy.sh backup    # Backup database
```

### **Manual Docker Commands**
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend

# Access container shell
docker-compose exec backend bash
```

---

## 🌐 PRODUCTION DEPLOYMENT

### **1. VPS/Dedicated Server Setup**
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Clone your repository
git clone https://github.com/yourusername/consultoria.git
cd consultoria

# Configure for production
cp .env.example .env
# Edit .env with production values

# Deploy
./docker-deploy.sh start
```

### **2. Domain & SSL Configuration**
```bash
# Update .env with your domain
VITE_API_URL=https://api.tudominio.cl
VITE_APP_URL=https://tudominio.cl
CORS_ORIGINS=https://tudominio.cl,https://www.tudominio.cl

# For SSL, use the production profile
docker-compose --profile production up -d
```

### **3. Nginx Reverse Proxy (Recommended)**
```nginx
# /etc/nginx/sites-available/consultoria
server {
    listen 80;
    server_name tudominio.cl www.tudominio.cl;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.cl www.tudominio.cl;
    
    ssl_certificate /etc/letsencrypt/live/tudominio.cl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.cl/privkey.pem;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 SECURITY CHECKLIST

### **✅ Required Security Measures**
- [ ] Change default admin credentials in `.env`
- [ ] Generate secure JWT and SECRET keys
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable automatic security updates

### **✅ Firewall Configuration**
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

---

## 📊 MONITORING & MAINTENANCE

### **Health Checks**
```bash
# API Health
curl http://localhost:5000/health

# Frontend
curl http://localhost

# Database connection
docker-compose exec db pg_isready -U consultoria_user
```

### **Log Management**
```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Export logs
docker-compose logs > consultoria_logs_$(date +%Y%m%d).txt
```

### **Backup Strategy**
```bash
# Automatic backup (daily)
0 2 * * * /path/to/consultoria/docker-deploy.sh backup

# Manual backup
./docker-deploy.sh backup

# Restore from backup
docker-compose exec -T db psql -U consultoria_user -d consultoria_db < backup_file.sql
```

---

## 🚨 TROUBLESHOOTING

### **Common Issues**

#### **Port Already in Use**
```bash
# Find process using port 5000
sudo lsof -i :5000
# Or port 80
sudo lsof -i :80

# Kill process or change ports in docker-compose.yml
```

#### **Database Connection Failed**
```bash
# Check database logs
docker-compose logs db

# Reset database (WARNING: This deletes all data!)
docker-compose down -v
docker-compose up -d
```

#### **Frontend Build Fails**
```bash
# Clear npm cache
docker-compose exec frontend npm cache clean --force

# Rebuild frontend
docker-compose build --no-cache frontend
```

#### **Backend Won't Start**
```bash
# Check Python dependencies
docker-compose exec backend pip check

# View detailed logs
docker-compose logs --tail=50 backend
```

### **Performance Issues**
```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart

# Scale backend (if needed)
docker-compose up -d --scale backend=3
```

---

## 📞 SUPPORT

### **Getting Help**
1. Check this documentation
2. Review logs: `docker-compose logs`
3. Test health endpoints
4. Check GitHub issues

### **Useful Commands**
```bash
# System information
docker system info
docker-compose version

# Clean up unused resources
docker system prune -a

# Update images
docker-compose pull
docker-compose up -d
```

---

## 🎯 NEXT STEPS

1. **Customize the application** with your branding
2. **Set up monitoring** (Prometheus, Grafana)
3. **Configure automated backups**
4. **Set up CI/CD pipeline**
5. **Configure email notifications**
6. **Add advanced analytics**

---

**🎉 Congratulations! Your HHBC Consultancy application is now running with Docker!**

For questions or issues, please refer to the troubleshooting section or check the application logs.