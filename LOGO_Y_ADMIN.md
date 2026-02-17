# 🎨 Logo y Acceso Administrativo - HHBC Consulting Group

## 📸 Logo

Para agregar el logo de HHBC Consulting Group:

1. Guarda tu imagen de logo como `logo-hhbc.png`
2. Colócala en la carpeta `public/` del proyecto
3. El logo se mostrará automáticamente en:
   - Favicon del sitio
   - Metadatos de redes sociales (Open Graph, Twitter)
   - Datos estructurados de SEO

### Ubicación del archivo:
```
HHBC-pagina/
  └── public/
      └── logo-hhbc.png  ← Coloca tu logo aquí
```

## 🔐 Acceso Administrativo

### Cómo acceder al panel de administración:

1. **URL de acceso:** 
   - `http://tudominio.com/admin`
   - `http://localhost:3000/admin` (en desarrollo)

2. **Credenciales por defecto:**
   - Usuario: `admin`
   - Contraseña: `admin123`

3. **El botón "Portal Admin" ha sido removido del menú principal** para mayor seguridad. Solo se puede acceder escribiendo `/admin` en la URL.

### Funcionalidades del panel admin:
- ✅ Dashboard con métricas
- ✅ Lista de leads/contactos
- ✅ Gestión de consultas
- ✅ Análisis de tráfico

## 🗺️ SEO y Optimización

### Sitemap
El sitemap está disponible en: `/sitemap.xml`
- Incluye todas las páginas principales
- Actualización: Semanal (página principal), Mensual (resto)
- Optimizado para Google Search Console

### Robots.txt
Configurado para:
- ✅ Permitir indexación de todo el sitio
- ❌ Bloquear acceso a `/admin` para motores de búsqueda
- 📍 Referencia al sitemap

### Metadatos SEO incluidos:
- ✅ Meta tags principales (title, description, keywords)
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Datos estructurados (Schema.org)
- ✅ URL canónica
- ✅ Favicon

### Título del sitio:
**HHBC Consulting Group, Chile**

## 📋 Menú de Navegación

El menú principal ahora solo muestra:
- 🏠 **Inicio**
- 💼 **Servicios**
- 📧 **Contacto**

## 🚀 Para producción

1. Actualiza las URLs en:
   - `index.html` (meta tags)
   - `sitemap.xml` (URLs del sitemap)
   - `seo-config.ts` (structured data)

2. Cambia el dominio de `hhbcconsulting.cl` por tu dominio real

3. Actualiza las credenciales de admin en las variables de entorno

## 📱 Contacto

Para más información o soporte, contacta con el equipo de desarrollo.
