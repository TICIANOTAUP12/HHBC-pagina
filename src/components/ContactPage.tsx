import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-4">Contáctenos</h1>
            <p className="text-lg text-gray-300">
              Estamos aquí para ayudarle a hacer crecer su empresa. Complete el formulario o utilice nuestra información de contacto para comunicarse con nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription className="text-base">
                    Nuestro equipo está disponible para atenderle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <MapPin className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1">Dirección</h4>
                      <p className="text-gray-600">
                        Av. Providencia 1234, Oficina 501<br />
                        Providencia, Santiago<br />
                        Región Metropolitana, Chile
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <Phone className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1">Teléfono</h4>
                      <p className="text-gray-600">
                        +56 9 1234 5678<br />
                        +56 2 2345 6789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <Mail className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1">Email</h4>
                      <p className="text-gray-600">
                        contacto@hhbc.cl<br />
                        consultas@hhbc.cl
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <Clock className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="mb-1">Horario de Atención</h4>
                      <p className="text-gray-600">
                        Lunes a Viernes: 9:00 - 18:00<br />
                        Sábado: 9:00 - 13:00<br />
                        Domingo: Cerrado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-white">¿Necesita ayuda urgente?</CardTitle>
                  <CardDescription className="text-base text-gray-300">
                    Llámenos directamente y un asesor le atenderá de inmediato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    <Phone className="mr-2" size={20} />
                    Llamar Ahora
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envíenos un Mensaje</CardTitle>
                  <CardDescription className="text-base">
                    Complete el formulario y nos pondremos en contacto con usted en menos de 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" placeholder="Juan" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" placeholder="Pérez" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="juan@empresa.cl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Teléfono</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" placeholder="Mi Empresa S.A." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Seleccione un asunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="legal">Asesoramiento Legal Estratégico</SelectItem>
                          <SelectItem value="it">Desarrollo y Consultoría IT</SelectItem>
                          <SelectItem value="accounting">Consultoría Económica y Contable</SelectItem>
                          <SelectItem value="general">Consulta General</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactMessage">Mensaje</Label>
                      <Textarea
                        id="contactMessage"
                        placeholder="Cuéntenos cómo podemos ayudarle..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="mt-1"
                        required
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-600">
                        Acepto la{" "}
                        <a href="#" className="text-accent hover:underline">
                          Política de Privacidad
                        </a>{" "}
                        y el tratamiento de mis datos personales
                      </label>
                    </div>

                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                      <Send className="mr-2" size={20} />
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Nuestra Ubicación</CardTitle>
                <CardDescription className="text-base">
                  Visítenos en nuestras oficinas en Santiago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-lg text-gray-500">Mapa interactivo</p>
                    <p className="text-gray-400">
                      Av. Providencia 1234, Santiago, Chile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>¿Cuál es el tiempo de respuesta?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Nos comprometemos a responder todas las consultas en un plazo máximo de 24 horas hábiles.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Ofrecen consultas gratuitas?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sí, ofrecemos una primera consulta gratuita de 30 minutos para evaluar sus necesidades y determinar cómo podemos ayudarle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Trabajan con empresas de todos los tamaños?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sí, nos especializamos en PYMES, el sector sindical y empresas con grandes flujos de trabajo en todo el territorio chileno.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}