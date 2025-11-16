# VPN Deployment Configuration for HHBC Consultancy

## 🔐 VPN-SPECIFIC CONFIGURATION

### **Environment Variables for VPN**
```bash
# Update .env file with VPN-specific settings
VITE_API_URL=https://consultoria-vpn.yourcompany.cl:8443
VITE_APP_URL=https://consultoria-vpn.yourcompany.cl
CORS_ORIGINS=https://consultoria-vpn.yourcompany.cl:8443,https://consultoria-vpn.yourcompany.cl

# Backend configuration
HOST=0.0.0.0
PORT=5000
FLASK_ENV=production
FLASK_DEBUG=False
```

### **Docker Compose for VPN**
```yaml
# docker-compose.vpn.yml
version: '3.8'

services:
  backend:
    ports:
      - "8443:5000"  # VPN-accessible port
    environment:
      - CORS_ORIGINS=https://consultoria-vpn.yourcompany.cl:8443
      
  frontend:
    ports:
      - "8080:80"    # VPN-accessible port
```

---

## 🌐 SUBDOMAIN CONFIGURATION

### **1. Internal DNS Setup**
```bash
# Add to your internal DNS server
consultoria-vpn.yourcompany.cl.  IN  A   192.168.1.100
api.consultoria-vpn.yourcompany.cl.  IN  A   192.168.1.100
```

### **2. Nginx Configuration for Subdomain**
```nginx
# /etc/nginx/sites-available/consultoria-vpn
server {
    listen 443 ssl http2;
    server_name consultoria-vpn.yourcompany.cl;
    
    ssl_certificate /etc/ssl/certs/consultoria-vpn.crt;
    ssl_certificate_key /etc/ssl/private/consultoria-vpn.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8443/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 VPN SECURITY CONFIGURATION

### **1. Firewall Rules for VPN**
```bash
# Allow VPN traffic only
sudo ufw allow from 10.0.0.0/8 to any port 8443
sudo ufw allow from 172.16.0.0/12 to any port 8443
sudo ufw allow from 192.168.0.0/16 to any port 8443

# Block external access
sudo ufw deny 8443
sudo ufw deny 8080
```

### **2. SSL Certificate for VPN**
```bash
# Generate self-signed certificate for VPN
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout consultoria-vpn.key \
  -out consultoria-vpn.crt \
  -subj "/C=CL/ST=Santiago/L=Santiago/O=HHBC/CN=consultoria-vpn.yourcompany.cl"
```

### **3. Docker Network Isolation**
```yaml
# docker-compose.vpn.yml
networks:
  consultoria-vpn:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 🚀 DEPLOYMENT STEPS FOR VPN

### **Step 1: Prepare VPN Environment**
```bash
# 1. Connect to VPN server
ssh admin@vpn-server.yourcompany.cl

# 2. Create deployment directory
mkdir -p /opt/hhbc-consultoria
cd /opt/hhbc-consultoria

# 3. Clone repository
git clone https://github.com/yourusername/consultoria.git .
```

### **Step 2: Configure for VPN**
```bash
# 1. Copy VPN-specific configuration
cp docker-compose.vpn.yml docker-compose.yml
cp .env.vpn .env

# 2. Generate SSL certificates
./scripts/generate-vpn-certificates.sh

# 3. Update environment variables
nano .env
```

### **Step 3: Deploy**
```bash
# 1. Deploy with VPN configuration
./docker-deploy.sh start

# 2. Configure nginx
sudo cp nginx/vpn.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/consultoria-vpn /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### **Step 4: Verify VPN Access**
```bash
# Test from VPN network
curl -k https://consultoria-vpn.yourcompany.cl:8443/
curl -k https://consultoria-vpn.yourcompany.cl/
```

---

## 📋 VPN-SPECIFIC CHECKLIST

### **Pre-Deployment**
- [ ] VPN connection tested
- [ ] Internal DNS configured
- [ ] SSL certificates generated
- [ ] Firewall rules configured
- [ ] Environment variables updated

### **Post-Deployment**
- [ ] Application accessible via VPN
- [ ] API endpoints working
- [ ] SSL certificates valid
- [ ] Security headers configured
- [ ] Logs monitoring setup

### **Security Verification**
- [ ] Only VPN IPs can access
- [ ] External access blocked
- [ ] SSL/TLS configured
- [ ] Admin credentials changed
- [ ] Audit logs enabled

---

## 🔧 TROUBLESHOOTING VPN ISSUES

### **Cannot Access via VPN**
```bash
# Check VPN connection
ping vpn-server.yourcompany.cl

# Check DNS resolution
nslookup consultoria-vpn.yourcompany.cl

# Check service status
docker-compose ps
```

### **SSL Certificate Issues**
```bash
# Check certificate validity
openssl x509 -in consultoria-vpn.crt -text -noout

# Test SSL connection
openssl s_client -connect consultoria-vpn.yourcompany.cl:8443
```

### **Docker Network Issues**
```bash
# Check Docker networks
docker network ls
docker network inspect consultoria_consultoria-network

# Restart with clean network
docker-compose down
docker network prune
docker-compose up -d
```

---

## 📊 MONITORING VPN DEPLOYMENT

### **Health Checks**
```bash
# Application health
curl -k https://consultoria-vpn.yourcompany.cl:8443/health

# VPN connectivity
curl -k https://consultoria-vpn.yourcompany.cl/

# Database connection
docker-compose exec db pg_isready -U consultoria_user
```

### **Log Monitoring**
```bash
# Application logs
docker-compose logs -f

# VPN access logs
tail -f /var/log/nginx/consultoria-vpn.access.log

# Security logs
tail -f /var/log/ufw.log
```

---

## 🎯 MIGRATION TO PUBLIC DOMAIN

### **When Ready for Public Access**

1. **Update Environment Variables**
```bash
# Change VPN URLs to public domain
VITE_API_URL=https://api.consultoria.cl
VITE_APP_URL=https://consultoria.cl
CORS_ORIGINS=https://consultoria.cl,https://www.consultoria.cl
```

2. **Update DNS Records**
```bash
# Public DNS
consultoria.cl.        IN  A   YOUR_PUBLIC_IP
api.consultoria.cl.    IN  A   YOUR_PUBLIC_IP
www.consultoria.cl.    IN  A   YOUR_PUBLIC_IP
```

3. **Update Firewall Rules**
```bash
# Allow public access
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 8443  # Block VPN port
```

4. **Get Public SSL Certificate**
```bash
# Use Let's Encrypt
certbot --nginx -d consultoria.cl -d api.consultoria.cl -d www.consultoria.cl
```

---

**🎉 Your HHBC Consultancy application is now configured for VPN deployment with easy migration to public domain when ready!**