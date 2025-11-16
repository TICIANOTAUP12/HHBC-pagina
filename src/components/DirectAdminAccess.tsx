import { useEffect } from "react";
import { toast } from "sonner";

interface DirectAdminAccessProps {
  onNavigate: (page: string) => void;
}

export function DirectAdminAccess({ onNavigate }: DirectAdminAccessProps) {
  useEffect(() => {
    console.log('🚀 Direct admin access triggered');
    
    // Set admin credentials directly
    localStorage.setItem("admin_token", "admin-demo-token-123");
    localStorage.setItem("user_role", "admin");
    
    toast.success("Acceso de administrador activado", {
      description: "Redirigiendo al dashboard...",
    });
    
    // Navigate directly to metrics
    setTimeout(() => {
      console.log('🔄 Redirecting to metrics...');
      window.location.href = '/';
      setTimeout(() => {
        onNavigate("metrics");
      }, 100);
    }, 1000);
    
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Activando Acceso de Admin...</h2>
        <p className="text-gray-600">Por favor espere mientras configuramos su sesión administrativa.</p>
      </div>
    </div>
  );
}