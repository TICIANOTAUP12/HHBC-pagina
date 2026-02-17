#!/bin/bash
# Script de build para producción - HHBC Consulting Group

echo "🏗️  Building HHBC Consulting Group - Producción"
echo "=================================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que exista .env.production
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  Archivo .env.production no encontrado${NC}"
    exit 1
fi

# Copiar configuración de producción
echo -e "${BLUE}📋 Configurando para producción...${NC}"
cp .env.production .env

# Build del frontend
echo -e "${BLUE}🎨 Building frontend...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build exitoso${NC}"
else
    echo -e "${YELLOW}❌ Error en build del frontend${NC}"
    exit 1
fi

# Crear directorio de producción
echo -e "${BLUE}📦 Preparando archivos de producción...${NC}"
mkdir -p dist-production
cp -r build dist-production/frontend
cp -r api dist-production/backend
cp nginx.conf dist-production/
cp docker-compose.yml dist-production/
cp .env.production dist-production/.env

echo ""
echo -e "${GREEN}=================================================="
echo "✅ Build de producción completado"
echo "=================================================="
echo ""
echo "📁 Archivos en: dist-production/"
echo ""
echo "🚀 Próximo paso: Desplegar usando Docker"
echo "   cd dist-production && docker-compose up -d"
echo "${NC}"
