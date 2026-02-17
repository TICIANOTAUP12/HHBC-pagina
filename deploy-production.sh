#!/bin/bash
# Script de despliegue para HHBC Consulting Group en producción

echo "🚀 Desplegando HHBC Consulting Group en sistemataup.online"
echo "============================================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde el directorio HHBC-pagina"
    exit 1
fi

# 1. Build del frontend
echo "📦 1. Compilando frontend..."
cp .env.production .env
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build del frontend"
    exit 1
fi
echo "✅ Frontend compilado en ./build/"
echo ""

# 2. Copiar configuración de nginx
echo "🌐 2. Configurando nginx..."
sudo cp hhbcconsultancy.sistemataup.online.conf /etc/nginx/sites-available/

# 3. Habilitar sitio
echo "🔗 3. Habilitando sitio..."
sudo ln -sf /etc/nginx/sites-available/hhbcconsultancy.sistemataup.online.conf /etc/nginx/sites-enabled/

# 4. Verificar configuración de nginx
echo "✔️  4. Verificando configuración de nginx..."
sudo nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Error en la configuración de nginx"
    exit 1
fi

# 5. Crear servicio systemd para el backend
echo "⚙️  5. Configurando servicio del backend..."
sudo tee /etc/systemd/system/hhbc-backend.service > /dev/null <<EOF
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
EOF

# 6. Recargar systemd y habilitar servicio
echo "🔄 6. Iniciando servicio del backend..."
sudo systemctl daemon-reload
sudo systemctl enable hhbc-backend
sudo systemctl restart hhbc-backend

# 7. Recargar nginx
echo "🔄 7. Recargando nginx..."
sudo systemctl reload nginx

echo ""
echo "============================================================"
echo "✅ Despliegue completado"
echo "============================================================"
echo ""
echo "🌐 Sitio disponible en: https://hhbcconsultancy.sistemataup.online"
echo "🔐 Panel admin: https://hhbcconsultancy.sistemataup.online/admin"
echo ""
echo "📊 Verificar servicios:"
echo "  sudo systemctl status hhbc-backend"
echo "  sudo systemctl status nginx"
echo ""
echo "📝 Ver logs:"
echo "  sudo tail -f /var/log/nginx/hhbc-access.log"
echo "  sudo journalctl -u hhbc-backend -f"
echo ""
