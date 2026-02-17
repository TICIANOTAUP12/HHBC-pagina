#!/bin/bash
# Script de inicio para desarrollo - HHBC Consulting Group

echo "🚀 Iniciando HHBC Consulting Group - Modo Desarrollo"
echo "=================================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar si .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Creando desde .env.example...${NC}"
    cp .env.example .env 2>/dev/null || echo "VITE_API_URL=http://localhost:5001" > .env
fi

# Verificar node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependencias del frontend...${NC}"
    npm install
fi

# Verificar virtual environment de Python
if [ ! -d "api/venv" ]; then
    echo -e "${BLUE}🐍 Creando entorno virtual de Python...${NC}"
    cd api && python3 -m venv venv && cd ..
fi

# Instalar dependencias de Python si no están instaladas
if [ ! -f "api/venv/bin/flask" ]; then
    echo -e "${BLUE}📦 Instalando dependencias del backend...${NC}"
    cd api && source venv/bin/activate && pip install -r requirements.txt && cd ..
fi

# Inicializar base de datos si no existe
if [ ! -f "api/consultoria.db" ]; then
    echo -e "${BLUE}🗄️  Inicializando base de datos...${NC}"
    cd api && source venv/bin/activate && python init_db.py && cd ..
fi

echo ""
echo -e "${GREEN}✅ Iniciando servicios...${NC}"
echo ""

# Iniciar backend en segundo plano
echo -e "${BLUE}🔧 Iniciando Backend API en puerto 5001...${NC}"
cd api && source venv/bin/activate && python app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend inicie
sleep 3

# Iniciar frontend
echo -e "${BLUE}🎨 Iniciando Frontend en puerto 8080...${NC}"
echo ""
echo -e "${GREEN}=================================================="
echo "✅ Servicios iniciados correctamente"
echo "=================================================="
echo ""
echo "🌐 Frontend: ${BLUE}http://localhost:8080${NC}"
echo "🔧 Backend:  ${BLUE}http://localhost:5001${NC}"
echo "🔐 Admin:    ${BLUE}http://localhost:8080/admin${NC}"
echo ""
echo "📝 Logs del backend: backend.log"
echo "⏹️  Para detener: Ctrl+C${NC}"
echo ""

# Iniciar frontend (esto bloqueará hasta Ctrl+C)
npm run dev

# Cuando se detiene el frontend, detener también el backend
echo ""
echo "Deteniendo servicios..."
kill $BACKEND_PID 2>/dev/null
echo "✅ Servicios detenidos"
