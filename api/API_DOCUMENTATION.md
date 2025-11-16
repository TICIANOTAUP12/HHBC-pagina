# API Documentation

## Backend API para Sistema de Métricas y Formulario de Contacto

### Descripción General
Este backend proporciona un sistema completo para:
- Registro y análisis de métricas de usuario
- Gestión de formularios de contacto
- Sistema de auditoría y logs
- Autenticación segura

### Base URL
```
http://localhost:5000/api
```

### Autenticación
Algunos endpoints requieren autenticación JWT. Incluir el token en el header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints de Métricas

### Track Metric
**POST** `/metrics/track`

Registra un evento de métrica en el sistema.

**Request Body:**
```json
{
  "event_type": "page_view",
  "page_url": "/home",
  "user_id": "user123",
  "session_id": "session123",
  "country": "Chile",
  "device_type": "desktop",
  "additional_data": {
    "custom_field": "value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "metric_id": 1,
  "message": "Metric tracked successfully"
}
```

### Get Analytics
**GET** `/metrics/analytics`

Obtiene estadísticas y análisis de métricas (requiere autenticación).

**Query Parameters:**
- `start_date` (optional): Fecha inicial (ISO format)
- `end_date` (optional): Fecha final (ISO format)
- `event_type` (optional): Filtrar por tipo de evento

**Response:**
```json
{
  "total_events": 150,
  "events_by_type": {
    "page_view": 100,
    "contact_form_submit": 50
  },
  "page_views": {
    "/home": 75,
    "/contact": 25
  },
  "unique_sessions": 120,
  "unique_users": 80,
  "device_breakdown": {
    "desktop": 100,
    "mobile": 50
  },
  "country_breakdown": {
    "Chile": 150
  }
}
```

---

## Endpoints de Formulario de Contacto

### Submit Contact Form
**POST** `/contact/submit`

Envía un nuevo formulario de contacto.

**Request Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@empresa.cl",
  "phone": "+56 9 1234 5678",
  "company": "Empresa S.A.",
  "subject": "legal",
  "message": "Necesito asesoramiento legal para mi empresa...",
  "session_id": "session123",
  "completion_time_seconds": 180,
  "field_interactions": {
    "first_name": true,
    "last_name": true,
    "email": true
  },
  "current_page": "/contact"
}
```

**Response:**
```json
{
  "success": true,
  "request_id": "uuid-12345",
  "message": "Contact form submitted successfully. We will respond within 24 hours."
}
```

### Get Contact Requests
**GET** `/contact/requests`

Obtiene lista de solicitudes de contacto (requiere autenticación).

**Query Parameters:**
- `status` (optional): Filtrar por estado (new, in_progress, resolved, closed)
- `priority` (optional): Filtrar por prioridad (low, medium, high, urgent)
- `start_date` (optional): Fecha inicial (ISO format)
- `end_date` (optional): Fecha final (ISO format)

**Response:**
```json
{
  "requests": [
    {
      "id": "uuid-12345",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@empresa.cl",
      "phone": "+56 9 1234 5678",
      "company": "Empresa S.A.",
      "subject": "legal",
      "message": "Necesito asesoramiento legal...",
      "status": "new",
      "priority": "medium",
      "assigned_to": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "responded_at": null,
      "notes": null,
      "source": "website"
    }
  ],
  "total": 1
}
```

### Get Single Contact Request
**GET** `/contact/requests/{request_id}`

Obtiene una solicitud específica (requiere autenticación).

**Response:** Mismo formato que el objeto individual en la lista anterior.

### Update Request Status
**PUT** `/contact/requests/{request_id}/status`

Actualiza el estado de una solicitud (requiere autenticación).

**Request Body:**
```json
{
  "status": "in_progress",
  "notes": "Cliente interesado en servicios legales para PYME"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "request": { /* updated request object */ }
}
```

---

## Endpoints de Autenticación

### Login
**POST** `/auth/login`

Autentica al usuario y retorna un token JWT.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin"
  }
}
```

---

## Códigos de Estado

- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Error en la solicitud
- **401**: No autorizado
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---

## Instalación y Configuración

### Requisitos
- Python 3.8+
- SQLite o PostgreSQL

### Instalación
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Inicializar base de datos
python app.py
```

### Variables de Entorno
```
DATABASE_URL=sqlite:///consultoria.db
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## Testing

Ejecutar tests:
```bash
python tests.py
```

---

## Seguridad

- Autenticación JWT para endpoints protegidos
- Validación de entrada de datos
- Rate limiting implícito
- Logs de auditoría para eventos importantes
- Sanitización de datos de usuario

## Integración con Frontend

### Ejemplo de integración del formulario de contacto:
```javascript
// Enviar formulario de contacto
async function submitContactForm(formData) {
  try {
    const response = await fetch('http://localhost:5000/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        session_id: sessionStorage.getItem('session_id'),
        completion_time_seconds: calculateFormCompletionTime(),
        field_interactions: trackFieldInteractions()
      })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Formulario enviado exitosamente');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Track page view
function trackPageView(pageUrl) {
  fetch('http://localhost:5000/api/metrics/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: 'page_view',
      page_url: pageUrl,
      session_id: sessionStorage.getItem('session_id'),
      user_id: localStorage.getItem('user_id'),
      device_type: getDeviceType(),
      country: getCountry()
    })
  });
}
```