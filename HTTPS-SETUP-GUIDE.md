# ⚡ Guía HTTPS para hhbcconsulting.cl

## 🚀 Inicio Rápido

### **Opción 1: Script Automático (RECOMENDADO)**

```bash
cd /home/main/Proyectos/HHBC_Landing/HHBC-pagina
sudo chmod +x setup-https-complete.sh
sudo ./setup-https-complete.sh
```

Este script hará TODO automáticamente:
- ✅ Valida Nginx
- ✅ Instala Certbot si falta
- ✅ Copia configuración Nginx
- ✅ Obtiene o verifica certificado SSL
- ✅ Configura renovación automática
- ✅ Reinicia Nginx
- ✅ Valida que todo funciona

**Tiempo estimado: 2-5 minutos**

---

## 🔧 Si quieres hacerlo manual

### **Paso 1: Instalar dependencias**
```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### **Paso 2: Copiar configuración**
```bash
sudo cp /home/main/Proyectos/HHBC_Landing/HHBC-pagina/nginx-hhbc.conf \
        /etc/nginx/sites-enabled/hhbc-consulting
```

### **Paso 3: Verificar sintaxis**
```bash
sudo nginx -t
```

### **Paso 4: Obtener certificado**
```bash
sudo certbot certonly --standalone \
  -d hhbcconsulting.cl \
  -d www.hhbcconsulting.cl \
  --agree-tos \
  --email contacto@hhbcconsulting.cl \
  --rsa-key-size 4096
```

### **Paso 5: Reiniciar Nginx**
```bash
sudo systemctl restart nginx
```

---

## ✅ Verificar que funciona

### **Prueba 1: Ver certificado**
```bash
sudo certbot certificates
```

Debería mostrar:
```
Found the following certs:
  Certificate Name: hhbcconsulting.cl
    Serial Number: ...
    Key Type: RSA
    Domains: hhbcconsulting.cl, www.hhbcconsulting.cl
    Expiry Date: 2027-XX-XX
    ...
```

### **Prueba 2: Status Nginx**
```bash
sudo systemctl status nginx
```

Debería mostrar: `active (running)`

### **Prueba 3: Curl**
```bash
curl -I https://hhbcconsulting.cl
```

Debería devolver `200 OK` (sin errores SSL)

### **Prueba 4: Redirección HTTP → HTTPS**
```bash
curl -I http://hhbcconsulting.cl
```

Debería devolver `301 Moved Permanently` a HTTPS

---

## 🔄 Renovación Automática

Let's Encrypt emite certificados válidos por 90 días. La renovación se configura automáticamente con:

```bash
sudo certbot renew --dry-run
```

Para verificar que está configurado:
```bash
sudo systemctl status certbot.timer
```

---

## 🐛 Troubleshooting

### ❌ "Connection refused"
```bash
# Verificar que Nginx está corriendo
sudo systemctl status nginx

# Si no, reiniciar
sudo systemctl restart nginx
```

### ❌ "Certificate file not found"
```bash
# Listar certificados existentes
sudo certbot certificates

# Si no hay ninguno, ejecutar:
sudo certbot certonly --standalone -d hhbcconsulting.cl -d www.hhbcconsulting.cl
```

### ❌ "Nginx config error"
```bash
# Probar sintaxis
sudo nginx -t

# Ver error en detalle
sudo nginx -T | less
```

### ❌ "Port 80 already in use"
```bash
# Ver qué está usando el puerto 80
sudo lsof -i :80

# Matar el proceso si es necesario
sudo kill -9 <PID>
```

---

## 📋 Archivos de Configuración

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| **nginx-hhbc.conf** | `/home/main/Proyectos/HHBC_Landing/HHBC-pagina/` | Configuración Nginx |
| **setup-https-complete.sh** | `/home/main/Proyectos/HHBC_Landing/HHBC-pagina/` | Script de setup automático |
| **Certificado** | `/etc/letsencrypt/live/hhbcconsulting.cl/` | Archivos SSL (generado por Certbot) |

---

## 🔐 Seguridad

La configuración incluye:
- ✅ SSL/TLS 1.2 y 1.3 (sin SSLv3, TLSv1.0, TLSv1.1)
- ✅ Ciphers modernos y seguros
- ✅ HSTS (Strict-Transport-Security)
- ✅ Headers de seguridad (X-Frame-Options, CSP, etc.)
- ✅ Compresión Gzip
- ✅ Redireccionamiento HTTP → HTTPS

---

## 📞 Soporte

Si algo falla, ejecuta el script con debugging:
```bash
sudo bash -x /home/main/Proyectos/HHBC_Landing/HHBC-pagina/setup-https-complete.sh 2>&1 | tee setup-debug.log
```

Esto guardará todos los detalles en `setup-debug.log` para analizar.
