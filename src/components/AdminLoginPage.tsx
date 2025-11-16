import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (page: string) => void;
}

export function AdminLoginPage({ onLoginSuccess, onNavigate }: AdminLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔑 Admin login attempt:', { username, password });

    try {
      // Demo authentication for admin
      if (username === "admin" && password === "admin123") {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store admin session
        localStorage.setItem("admin_token", "admin-demo-token-123");
        localStorage.setItem("user_role", "admin");
        
        console.log('✅ Admin authentication successful');
        
        toast.success("Autenticación exitosa", {
          description: "Bienvenido al sistema de administración",
        });
        
        // Redirect to sales dashboard after successful login
        setTimeout(() => {
          console.log('🔄 Navigating to dashboard...');
          onLoginSuccess(); // Update user role first
          window.location.href = '/';
          setTimeout(() => {
            onNavigate("dashboard"); // Then navigate to dashboard
          }, 100);
        }, 1500);
      } else {
        toast.error("Credenciales inválidas", {
          description: "Usuario o contraseña incorrectos",
        });
      }
    } catch (error) {
      toast.error("Error de autenticación", {
        description: "Ocurrió un error al intentar iniciar sesión",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portal de Administración
          </h1>
          <p className="text-gray-600">
            Acceso exclusivo para administradores
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 h-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Credenciales de demostración:
              </p>
              <p className="text-xs text-blue-600">
                Usuario: <span className="font-mono font-bold">admin</span>
              </p>
              <p className="text-xs text-blue-600">
                Contraseña: <span className="font-mono font-bold">admin123</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="text-gray-600 hover:text-gray-900"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}