// Debug script to check authentication state
console.log('🔍 Debug Admin Authentication');

// Check current localStorage state
console.log('📊 localStorage items:');
console.log('- admin_token:', localStorage.getItem('admin_token'));
console.log('- user_role:', localStorage.getItem('user_role'));

// Check current page
console.log('📍 Current page state:', window.currentPage || 'Not set');

// Function to test login directly
function testDirectLogin() {
    console.log('🧪 Testing direct login...');
    
    // Set admin credentials
    localStorage.setItem('admin_token', 'admin-demo-token-123');
    localStorage.setItem('user_role', 'admin');
    
    console.log('✅ Credentials set in localStorage');
    console.log('🔄 Please refresh the page to see admin interface');
    
    // Force redirect to metrics
    setTimeout(() => {
        window.location.href = '/';
        setTimeout(() => {
            window.currentPage = 'metrics';
        }, 100);
    }, 500);
}

// Function to clear auth
function clearAuth() {
    console.log('🧹 Clearing authentication...');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    console.log('✅ Authentication cleared');
    console.log('🔄 Please refresh the page');
}

console.log('🛠️ Available debug functions:');
console.log('  - testDirectLogin(): Set admin credentials and redirect');
console.log('  - clearAuth(): Clear authentication');

// Add global debug helpers
window.testDirectLogin = testDirectLogin;
window.clearAuth = clearAuth;

console.log('✨ Debug tools ready!');