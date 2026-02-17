# 🚀 Despliegue en sistemataup.online - HHBC Consulting Group

## 📋 Información del Servidor

**Dominio:** `hhbcconsultinggroup.sistemataup.online`
**Servidor:** srv734895.hstgr.cloud
**Nginx:** Instalado y configurado con múltiples sitios

## ⚡ Despliegue Rápido

### Opción 1: Script Automático (Recomendado)

```bash
cd /home/main/Proyectos/HHBC_Landing/HHBC-pagina
./deploy-production.sh
```

Este script hará automáticamente:
1. ✅ Build del frontend
2. ✅ Configuración de nginx
3. ✅ Crear servicio systemd del backend
4. ✅ Iniciar todos los servicios

### Opción 2: Despliegue Manual

#### 1. Compilar Frontend

```bash
cd /home/main/Proyectos/HHBC_Landing/HHBC-pagina

# Usar configuración de producción
cp .env.production .env

# Build
npm run build
```

#### 2. Configurar Nginx

```bash
# Copiar configuración
sudo cp hhbcconsultinggroup.sistemataup.online.conf /etc/nginx/sites-available/

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/hhbcconsultinggroup.sistemataup.online.conf /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar nginx
sudo systemctl reload nginx
```

#### 3. Configurar Backend como Servicio

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/hhbc-backend.service
```

Contenido:
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

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio
sudo systemctl enable hhbc-backend

# Iniciar servicio
sudo systemctl start hhbc-backend

# Verificar estado
sudo systemctl status hhbc-backend
```

## 🌐 URLs del Sitio

- **Sitio principal:** http://hhbcconsultinggroup.sistemataup.online
- **Panel admin:** http://hhbcconsultinggroup.sistemataup.online/admin
- **API:** http://hhbcconsultinggroup.sistemataup.online/api/

## 🔐 Credenciales por Defecto

**Panel Admin:**
- Usuario: `admin`
- Contraseña: `admin123`

⚠️ **IMPORTANTE:** Cambiar estas credenciales en `.env.production`

## 📊 Verificación y Monitoreo

### Verificar Servicios

```bash
# Estado del backend
sudo systemctl status hhbc-backend

# Estado de nginx
sudo systemctl status nginx

# Ver logs del backend
sudo journalctl -u hhbc-backend -f

# Ver logs de nginx
sudo tail -f /var/log/nginx/hhbc-access.log
sudo tail -f /var/log/nginx/hhbc-error.log
```

### Probar el Sitio

```bash
# Desde el servidor
curl -I http://hhbcconsultinggroup.sistemataup.online

# Verificar backend
curl http://hhbcconsultinggroup.sistemataup.online/api/

# Verificar sitemap
curl http://hhbcconsultinggroup.sistemataup.online/sitemap.xml
```

## 🔄 Actualizaciones

Para actualizar el sitio después de cambios:

```bash
cd /home/main/Proyectos/HHBC_Landing/HHBC-pagina

# Pull cambios
git pull origin main

# Reinstalar dependencias si hay cambios
npm install
cd api && source venv/bin/activate && pip install -r requirements.txt && cd ..

# Redesplegar
./deploy-production.sh
```

O manualmente:

```bash
# Recompilar frontend
npm run build

# Reiniciar backend
sudo systemctl restart hhbc-backend

# Recargar nginx
sudo systemctl reload nginx
```

## 🔧 Comandos Útiles

```bash
# Reiniciar backend
sudo systemctl restart hhbc-backend

# Detener backend
sudo systemctl stop hhbc-backend

# Ver logs en tiempo real
sudo journalctl -u hhbc-backend -f

# Recargar nginx sin downtime
sudo systemctl reload nginx

# Verificar sintaxis de nginx
sudo nginx -t

# Ver todos los sitios habilitados
ls -la /etc/nginx/sites-enabled/
```

## 📁 Estructura de Archivos

```
/home/main/Proyectos/HHBC_Landing/HHBC-pagina/
├── build/                                    # Frontend compilado (aquí apunta nginx)
├── api/                                       # Backend Flask
│   ├── venv/                                 # Entorno virtual Python
│   ├── app.py                                # Aplicación principal
│   └── consultoria.db                        # Base de datos
├── hhbcconsultinggroup.sistemataup.online.conf  # Configuración nginx
├── deploy-production.sh                      # Script de despliegue
└── .env.production                           # Variables de entorno

/etc/nginx/
├── sites-available/
│   └── hhbcconsultinggroup.sistemataup.online.conf
└── sites-enabled/
    └── hhbcconsultinggroup.sistemataup.online.conf → sites-available/...

/etc/systemd/system/
└── hhbc-backend.service                      # Servicio del backend
```

## 🐛 Troubleshooting

### El sitio no carga

```bash
# Verificar nginx
sudo systemctl status nginx
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/hhbc-error.log
```

### El backend no responde

```bash
# Verificar servicio
sudo systemctl status hhbc-backend

# Ver logs
sudo journalctl -u hhbc-backend -n 50

# Reiniciar manualmente
sudo systemctl restart hhbc-backend
```

### Error 502 Bad Gateway

Significa que nginx no puede conectar con el backend:

```bash
# Verificar que el backend esté corriendo
sudo systemctl status hhbc-backend

# Verificar que esté escuchando en puerto 5001
sudo netstat -tlnp | grep 5001

# Ver logs del backend
sudo journalctl -u hhbc-backend -f
```

### Permisos de archivos

```bash
# Asegurar que nginx pueda leer los archivos
sudo chown -R main:www-data /home/main/Proyectos/HHBC_Landing/HHBC-pagina/build
sudo chmod -R 755 /home/main/Proyectos/HHBC_Landing/HHBC-pagina/build
```

## 🔒 SSL/HTTPS (Opcional)

Para habilitar HTTPS con Let's Encrypt:

```bash
# Instalar certbot si no está instalado
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d hhbcconsultinggroup.sistemataup.online

# Certbot configurará automáticamente HTTPS
# Renovación automática ya está configurada
```

## 📚 Documentación Relacionada

- [NGINX_DEPLOYMENT.md](NGINX_DEPLOYMENT.md) - Guía general de nginx
- [CAMBIOS_IMPLEMENTADOS.md](CAMBIOS_IMPLEMENTADOS.md) - Log de cambios
- [INSTRUCCIONES_LOGO.txt](INSTRUCCIONES_LOGO.txt) - Cómo agregar el logo
- [LOGO_Y_ADMIN.md](LOGO_Y_ADMIN.md) - Acceso administrativo

## ✅ Checklist de Despliegue

- [ ] Build del frontend ejecutado (`npm run build`)
- [ ] Configuración de nginx copiada a sites-available
- [ ] Sitio habilitado en sites-enabled
- [ ] Nginx verificado (`nginx -t`)
- [ ] Servicio systemd del backend creado
- [ ] Backend iniciado y habilitado
- [ ] Sitio accesible desde el navegador
- [ ] Panel admin accesible en /admin
- [ ] API funcionando correctamente
- [ ] Logs verificados sin errores
- [ ] Credenciales de admin cambiadas (producción)

---

**Última actualización:** 16 de Febrero, 2026  
**Dominio:** hhbcconsultinggroup.sistemataup.online  
**Puerto Backend:** 5001  
**Puerto Nginx:** 80 (HTTP)
