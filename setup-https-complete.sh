#!/bin/bash

# Script completo para configurar HTTPS sin drama
# Maneja todos los casos: certificado existente, instalación de certbot, etc.

set -e

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
COLOR_BLUE='\033[0;34m'

echo -e "${COLOR_BLUE}════════════════════════════════════════════════════════════${COLOR_RESET}"
echo -e "${COLOR_BLUE}  Configuración HTTPS para hhbcconsulting.cl${COLOR_RESET}"
echo -e "${COLOR_BLUE}════════════════════════════════════════════════════════════${COLOR_RESET}\n"

# Verificar permisos
if [[ $EUID -ne 0 ]]; then
   echo -e "${COLOR_RED}❌ Este script debe ejecutarse con sudo${COLOR_RESET}"
   echo "   sudo bash $(basename "$0")"
   exit 1
fi

DOMAIN="hhbcconsulting.cl"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
NGINX_CONF="/etc/nginx/sites-enabled/hhbc-consulting"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Verificar Nginx
echo -e "${COLOR_YELLOW}📦 Verificando Nginx...${COLOR_RESET}"
if ! command -v nginx &> /dev/null; then
    echo -e "${COLOR_RED}❌ Nginx no instalado${COLOR_RESET}"
    echo "   Instalando..."
    apt-get update && apt-get install -y nginx
else
    echo -e "${COLOR_GREEN}✅ Nginx instalado${COLOR_RESET}"
fi

# 2. Verificar Certbot
echo -e "\n${COLOR_YELLOW}📦 Verificando Certbot...${COLOR_RESET}"
if ! command -v certbot &> /dev/null; then
    echo -e "${COLOR_RED}❌ Certbot no instalado${COLOR_RESET}"
    echo "   Instalando..."
    apt-get update && apt-get install -y certbot python3-certbot-nginx
else
    echo -e "${COLOR_GREEN}✅ Certbot instalado${COLOR_RESET}"
fi

# 3. Copiar configuración nginx si no existe
echo -e "\n${COLOR_YELLOW}📝 Verificando configuración Nginx...${COLOR_RESET}"
if [ ! -f "$NGINX_CONF" ]; then
    echo "   Copiando configuración a /etc/nginx/sites-enabled/"
    cp "$CURRENT_DIR/nginx-hhbc.conf" "$NGINX_CONF"
    echo -e "${COLOR_GREEN}✅ Configuración copiada${COLOR_RESET}"
else
    echo -e "${COLOR_GREEN}✅ Configuración ya existe${COLOR_RESET}"
fi

# 4. Verificar sintaxis nginx
echo -e "\n${COLOR_YELLOW}🔍 Verificando sintaxis Nginx...${COLOR_RESET}"
if nginx -t &>/dev/null; then
    echo -e "${COLOR_GREEN}✅ Sintaxis correcta${COLOR_RESET}"
else
    echo -e "${COLOR_RED}❌ Error en la sintaxis Nginx${COLOR_RESET}"
    nginx -t
    exit 1
fi

# 5. Verificar/Obtener certificado
echo -e "\n${COLOR_YELLOW}🔐 Verificando certificado SSL...${COLOR_RESET}"
if [ -d "$CERT_PATH" ] && [ -f "$CERT_PATH/fullchain.pem" ]; then
    echo -e "${COLOR_GREEN}✅ Certificado existente encontrado${COLOR_RESET}"
    echo "   Ruta: $CERT_PATH"
    
    # Verificar si va a vencer pronto
    EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH/fullchain.pem" | cut -d= -f2)
    echo "   Vencimiento: $EXPIRY"
else
    echo -e "${COLOR_YELLOW}⚠️  Certificado no encontrado${COLOR_RESET}"
    echo "   Obteniendo nuevo certificado con Let's Encrypt..."
    
    # Crear directorio temporal para validación HTTP
    mkdir -p /tmp/letsencrypt
    
    certbot certonly --standalone \
        -d hhbcconsulting.cl \
        -d www.hhbcconsulting.cl \
        --agree-tos \
        --non-interactive \
        --email contacto@hhbcconsulting.cl \
        --rsa-key-size 4096 || {
        echo -e "${COLOR_RED}❌ Error obteniendo certificado${COLOR_RESET}"
        exit 1
    }
    
    echo -e "${COLOR_GREEN}✅ Certificado obtenido${COLOR_RESET}"
fi

# 6. Configurar renovación automática
echo -e "\n${COLOR_YELLOW}🔄 Configurando renovación automática...${COLOR_RESET}"
certbot renew --dry-run &>/dev/null && echo -e "${COLOR_GREEN}✅ Renovación automática configurada${COLOR_RESET}"

# 7. Reiniciar Nginx
echo -e "\n${COLOR_YELLOW}🔄 Reiniciando Nginx...${COLOR_RESET}"
systemctl restart nginx
echo -e "${COLOR_GREEN}✅ Nginx reiniciado${COLOR_RESET}"

# 8. Verificar que nginx está corriendo
echo -e "\n${COLOR_YELLOW}🔍 Verificando estado...${COLOR_RESET}"
if systemctl is-active --quiet nginx; then
    echo -e "${COLOR_GREEN}✅ Nginx está corriendo${COLOR_RESET}"
else
    echo -e "${COLOR_RED}❌ Error: Nginx no está corriendo${COLOR_RESET}"
    exit 1
fi

# 9. Resumen
echo -e "\n${COLOR_BLUE}════════════════════════════════════════════════════════════${COLOR_RESET}"
echo -e "${COLOR_GREEN}✅ ¡HTTPS configurado exitosamente!${COLOR_RESET}"
echo -e "${COLOR_BLUE}════════════════════════════════════════════════════════════${COLOR_RESET}\n"

echo "📋 Resumen:"
echo "   Dominio: $DOMAIN"
echo "   Certificado: $CERT_PATH"
echo "   Configuración: $NGINX_CONF"
echo ""
echo "🔗 URLs funcionales:"
echo "   https://hhbcconsulting.cl"
echo "   https://www.hhbcconsulting.cl"
echo ""
echo "🔧 Comandos útiles:"
echo "   Verificar status: systemctl status nginx"
echo "   Renovar certificado: sudo certbot renew"
echo "   Ver certificados: sudo certbot certificates"
echo ""
