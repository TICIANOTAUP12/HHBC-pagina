# 🌐 Guía de Despliegue con Nginx - HHBC Consulting Group

## 📋 Resumen

Tu servidor ya tiene Nginx instalado y funcionando. Esta guía te ayudará a configurar HHBC Consulting Group para que funcione con Nginx en producción.

## 🔍 Estado Actual

✅ **Nginx instalado:** nginx/1.24.0 (Ubuntu)
✅ **Ubicación config:** /etc/nginx/
✅ **Desarrollo actual:** 
   - Frontend: http://localhost:8080 (Vite)
   - Backend: http://localhost:5001 (Flask)

## 🚀 Pasos para Despliegue con Nginx

### 1️⃣ Build del Frontend

```bash
cd /home/main/Proyectos/HHBC_Landing/HHBC-pagina

# Usar configuración de producción
cp .env.production .env

# Compilar frontend
npm run build

# Esto creará la carpeta 'build/' con los archivos estáticos
```

### 2️⃣ Copiar Configuración de Nginx

```bash
# Copiar el archivo de configuración
sudo cp nginx-hhbc.conf /etc/nginx/sites-available/hhbc-consulting

# Editar y ajustar dominio y rutas si es necesario
sudo nano /etc/nginx/sites-available/hhbc-consulting

# Crear enlace simbólico para habilitar el sitio
sudo ln -s /etc/nginx/sites-available/hhbc-consulting /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Si todo está OK, recargar nginx
sudo systemctl reload nginx
```

### 3️⃣ Configurar Backend como Servicio

Crear servicio systemd para el backend:

```bash
sudo nano /etc/systemd/system/hhbc-backend.service
```

Contenido del archivo:

```ini
[Unit]
Description=HHBC Consulting Backend API
After=network.target

[Service]
Type=simple
User=main
WorkingDirectory=/home/main/Proyectos/HHBC_Landing/HHBC-pagina/api
Environment="PATH=/home/main/Proyectos/HHBC_Landing/HHBC-pagina/api/venv/bin"
Environment="FLASK_ENV=production"
Environment="PORT=5001"
ExecStart=/home/main/Proyectos/HHBC_Landing/HHBC-pagina/api/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Habilitar y arrancar el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl enable hhbc-backend
sudo systemctl start hhbc-backend
sudo systemctl status hhbc-backend
```

### 4️⃣ Configurar SSL (Opcional pero Recomendado)

```bash
# Instalar certbot si no está instalado
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d hhbcconsulting.cl -d www.hhbcconsulting.cl

# Certbot configurará automáticamente HTTPS
```

## 📊 Verificación

### Verificar servicios:

```bash
# Nginx
sudo systemctl status nginx

# Backend
sudo systemctl status hhbc-backend

# Ver logs de nginx
sudo tail -f /var/log/nginx/hhbc-access.log
sudo tail -f /var/log/nginx/hhbc-error.log

# Ver logs del backend
sudo journalctl -u hhbc-backend -f
```

### Probar el sitio:

```bash
# Desde el servidor
curl -I http://localhost

# Desde navegador
http://tu-dominio.com
http://tu-dominio.com/admin
```

## 🔧 Configuración Actual del Archivo nginx-hhbc.conf

**Características:**
- ✅ Puerto 80 (HTTP)
- ✅ Routing SPA (funciona con /admin)
- ✅ Proxy al backend en puerto 5001
- ✅ Headers de seguridad
- ✅ Compresión gzip
- ✅ Cache de assets estáticos
- ✅ Preparado para SSL (comentado)

**Endpoints configurados:**
- `/` → Frontend React (con routing)
- `/api/` → Backend Flask (proxy a localhost:5001)

## 🎯 Alternativa: Desarrollo Sin Nginx

Si prefieres seguir en desarrollo:

```bash
# Mantener como está actualmente
# Frontend: http://localhost:8080
# Backend: http://localhost:5001
```

## 📝 Notas Importantes

1. **Dominio:** Actualizar `server_name` en nginx-hhbc.conf con tu dominio real
2. **Permisos:** Asegúrate que nginx tenga permisos para leer /build
3. **Firewall:** Abrir puerto 80 (y 443 si usas HTTPS)
4. **Backend:** El backend Flask debe estar corriendo en puerto 5001
5. **Variables de entorno:** Usar .env.production para producción

## 🔄 Comandos Útiles

```bash
# Recargar nginx
sudo systemctl reload nginx

# Reiniciar nginx
sudo systemctl restart nginx

# Ver configuración activa
sudo nginx -T

# Verificar sintaxis
sudo nginx -t

# Ver sitios habilitados
ls -la /etc/nginx/sites-enabled/

# Deshabilitar sitio
sudo rm /etc/nginx/sites-enabled/hhbc-consulting

# Ver puertos en uso
sudo netstat -tlnp | grep nginx
```

## 📚 Documentación Relacionada

- `CAMBIOS_IMPLEMENTADOS.md` - Cambios recientes
- `INSTRUCCIONES_LOGO.txt` - Instrucciones del logo
- `LOGO_Y_ADMIN.md` - Acceso administrativo
- `start-dev.sh` - Script de desarrollo
- `build-production.sh` - Script de build

---

**Estado del servidor:** Nginx corriendo con múltiples sitios
**Tu proyecto:** Actualmente en desarrollo (Vite + Flask directo)
**Próximo paso:** Decidir si desplegar con Nginx o mantener desarrollo
