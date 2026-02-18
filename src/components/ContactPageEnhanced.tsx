import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

interface FieldInteraction {
  [key: string]: boolean;
}

export function ContactPageEnhanced() {
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldInteractions, setFieldInteractions] = useState<FieldInteraction>({});
  const [formStartTime] = useState(Date.now());
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Track field interactions for analytics
  const handleFieldInteraction = (fieldName: string) => {
    if (!fieldInteractions[fieldName]) {
      setFieldInteractions(prev => ({
        ...prev,
        [fieldName]: true
      }));
    }
  };

  // Track page view on component mount
  useEffect(() => {
    trackPageView('/contact');
  }, []);

  const trackPageView = async (pageUrl: string) => {
    try {
      const sessionId = getOrCreateSessionId();
      const userId = localStorage.getItem('user_id');

      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/metrics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'page_view',
          page_url: pageUrl,
          session_id: sessionId,
          user_id: userId,
          device_type: getDeviceType(),
          country: 'Chile' // Could be enhanced with geolocation
        })
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const getOrCreateSessionId = (): string => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const generateSessionId = (): string => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const getDeviceType = (): string => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad/.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    handleFieldInteraction(field);
  };

  const validateForm = (): boolean => {
    if (!formData.first_name.trim()) {
      toast.error('Por favor ingrese su nombre');
      return false;
    }
    if (!formData.last_name.trim()) {
      toast.error('Por favor ingrese su apellido');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Por favor ingrese su email');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      toast.error('Por favor ingrese un email válido');
      return false;
    }
    if (!formData.subject) {
      toast.error('Por favor seleccione un asunto');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Por favor ingrese su mensaje');
      return false;
    }
    if (!privacyAccepted) {
      toast.error('Por favor acepte la política de privacidad');
      return false;
    }
    return true;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculateCompletionTime = (): number => {
    return Math.round((Date.now() - formStartTime) / 1000);
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sessionId = getOrCreateSessionId();
      const completionTime = calculateCompletionTime();

      // Only send required fields to Google Sheets endpoint
      const backendData = {
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };

      const response = await fetch(`/api/contact-to-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      const result = await response.json();

      if (response.ok && result.status === 'ok') {
        toast.success('¡Mensaje enviado exitosamente! Hemos recibido su consulta.');
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
        setFieldInteractions({});
        setPrivacyAccepted(false);
      } else {
        toast.error(result.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error al conectar con el servidor. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackConversionEvent = async (eventType: string, requestId: string) => {
    try {
      const sessionId = getOrCreateSessionId();

      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/metrics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          page_url: '/contact',
          session_id: sessionId,
          user_id: localStorage.getItem('user_id'),
          additional_data: {
            request_id: requestId,
            form_type: 'contact'
          }
        })
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

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
                        APOQUINDO 7331 OF 203 EDIF 1 PS2<br />
                        LAS CONDES, SANTIAGO<br />
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
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre *</Label>
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          required
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          required
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="juan@empresa.cl"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Teléfono</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        placeholder="Mi Empresa S.A."
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleInputChange('subject', value)}
                        disabled={isSubmitting}
                      >
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
                      <Label htmlFor="contactMessage">Mensaje *</Label>
                      <Textarea
                        id="contactMessage"
                        placeholder="Cuéntenos cómo podemos ayudarle..."
                        rows={6}
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="mt-1"
                        required
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-600">
                        Acepto la{" "}
                        <a href="#" className="text-accent hover:underline">
                          Política de Privacidad
                        </a>
                        {" "}
                        y el tratamiento de mis datos personales *
                      </label>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Enviar Mensaje
                        </>
                      )}
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