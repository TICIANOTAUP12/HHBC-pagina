#!/bin/bash

# Script para obtener certificado SSL con Let's Encrypt (Certbot)
# Para hhbcconsulting.cl

set -e

echo "════════════════════════════════════════════════════════════"
echo "Obtener certificado SSL para hhbcconsulting.cl"
echo "════════════════════════════════════════════════════════════"

# Verificar si somos root o sudo
if [[ $EUID -ne 0 ]]; then
   echo "Este script debe ejecutarse con sudo o como root"
   exit 1
fi

# Verificar si certbot está instalado
if ! command -v certbot &> /dev/null
then
    echo "certbot no está instalado. Instalando..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Obtener el certificado
echo "Obteniendo certificado para hhbcconsulting.cl..."
certbot certonly --nginx \
  -d hhbcconsulting.cl \
  -d www.hhbcconsulting.cl \
  --agree-tos \
  --non-interactive \
  --email contacto@hhbcconsulting.cl \
  --rsa-key-size 4096

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Certificado obtenido exitosamente"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Ubicación del certificado:"
echo "  - Certificado: /etc/letsencrypt/live/hhbcconsulting.cl/fullchain.pem"
echo "  - Clave privada: /etc/letsencrypt/live/hhbcconsulting.cl/privkey.pem"
echo ""
echo "Próximos pasos:"
echo "  1. Reiniciar nginx: sudo systemctl restart nginx"
echo "  2. Probar la configuración: sudo nginx -t"
echo ""
echo "Para renovación automática:"
echo "  certbot renew --dry-run"
echo ""
