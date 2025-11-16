// Script de diagnóstico para el problema de MetricsDashboard
console.log('🔍 Diagnóstico de MetricsDashboard');

// Verificar estado actual
const token = localStorage.getItem('admin_token');
const role = localStorage.getItem('user_role');
const currentPage = window.currentPage;

console.log('📊 Estado actual:', {
  token: token,
  role: role,
  currentPage: currentPage
});

// Forzar autenticación
function forzarAuthMetrics() {
  console.log('🚀 Forzando autenticación para MetricsDashboard...');
  
  // Establecer token correcto
  localStorage.setItem('admin_token', 'admin-demo-token-123');
  localStorage.setItem('user_role', 'admin');
  
  // Recargar la página
  window.location.href = '/';
  
  setTimeout(() => {
    // Navegar a métricas
    if (window.onNavigate) {
      window.onNavigate('metrics');
    }
  }, 500);
}

// Limpiar todo
function limpiarAuth() {
  console.log('🧹 Limpiando autenticación...');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('auth_token');
  window.location.reload();
}

console.log('🛠️ Funciones disponibles:');
console.log('- forzarAuthMetrics(): Fuerza autenticación y va a métricas');
console.log('- limpiarAuth(): Limpia toda la autenticación');

// Asignar funciones globales
window.forzarAuthMetrics = forzarAuthMetrics;
window.limpiarAuth = limpiarAuth;

console.log('✅ Diagnóstico listo. Intenta forzarAuthMetrics()');