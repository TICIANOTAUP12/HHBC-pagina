import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logo from "figma:asset/ae732d0ec8a13c75470aa82ad1192c40d14b1747.png";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              <div>
                <img src={logo} alt="HHBC Consulting Group" className="h-20 w-auto mb-6" />
              </div>

              <div>
                <h1 className="mb-4">Área de Clientes</h1>
                <p className="text-lg text-gray-600">
                  Acceda a su portal personalizado para gestionar sus servicios, documentos y comunicaciones con nuestro equipo de expertos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <p className="text-sm">Acceso 24/7 a sus documentos</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <p className="text-sm">Comunicación directa con su asesor</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <p className="text-sm">Seguimiento de proyectos en tiempo real</p>
                </div>
              </div>

              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518729908-d4220a678d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGNvbnN1bHRpbmd8ZW58MXx8fHwxNzYyMjk2OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional workspace"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Acceda a su cuenta para gestionar sus servicios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail">Email o Usuario</Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="loginEmail"
                        type="text"
                        placeholder="usuario@empresa.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loginPassword">Contraseña</Label>
                      <a
                        href="#"
                        className="text-sm text-accent hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Mantener sesión iniciada
                    </label>
                  </div>

                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                    Iniciar Sesión
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                      o
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button variant="outline" className="w-full">
                      <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18">
                        <path
                          fill="#4285F4"
                          d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"
                        />
                        <path
                          fill="#34A853"
                          d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"
                        />
                        <path
                          fill="#EA4335"
                          d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"
                        />
                      </svg>
                      Continuar con Google
                    </Button>

                    <Button variant="outline" className="w-full">
                      <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continuar con Facebook
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tiene una cuenta?{" "}
                    <a href="#" className="text-accent hover:underline">
                      Solicitar acceso
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="mt-6 bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent flex-shrink-0 mt-1">
                    <Mail className="text-white" size={16} />
                  </div>
                  <div>
                    <h4 className="mb-1">¿Necesita ayuda?</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Si es cliente y no tiene acceso al portal, contáctenos y crearemos su cuenta.
                    </p>
                    <a href="#" className="text-sm text-accent hover:underline">
                      Contactar soporte →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}