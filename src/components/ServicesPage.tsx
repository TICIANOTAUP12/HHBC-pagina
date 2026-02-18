import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Scale,
  Code,
  Calculator,
  FileText,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Brain,
  Server,
  Workflow,
  FileCheck,
  TrendingUp,
  Calculator as CalcIcon,
} from "lucide-react";
import { ServiceImage, serviceImages } from "./figma/ServiceImage";

interface ServicesPageProps {
  serviceId?: string;
  onNavigate: (page: string) => void;
}

export function ServicesPage({ serviceId = "legal", onNavigate }: ServicesPageProps) {
  const servicesData = {
    legal: {
      title: "Asesoramiento Legal Estratégico",
      subtitle: "Tu Seguro Legal con Cobertura Completa",
      description:
        "Ofrecemos un modelo de suscripción mensual que funciona como un seguro legal para tu empresa. Obtén acceso a un grupo de abogados altamente capacitados y dedicados a tu compañía, sin el alto costo fijo de un departamento legal interno.",
      icon: Scale,
      color: "from-accent to-blue-500",
      image: "/assets/legal-responsible.jpg",
      subservices: [
        {
          name: "Suscripción Mensual",
          description: "Pago fijo mensual que te da acceso permanente a asesoría legal estratégica",
          icon: FileText,
        },
        {
          name: "Equipo Dedicado",
          description: "Abogados especializados y comprometidos con tu empresa",
          icon: Users,
        },
        {
          name: "Cobertura Integral",
          description: "Desde derecho corporativo hasta cumplimiento normativo completo",
          icon: Shield,
        },
        {
          name: "Subcontratación de Élite",
          description: "Calidad de departamento legal interno sin los costos fijos",
          icon: Scale,
        },
      ],
      benefits: [
        "Ahorro significativo vs. departamento legal interno",
        "Acceso inmediato a abogados especializados",
        "Cobertura legal completa para tu empresa",
        "Asesoramiento estratégico permanente",
      ],
    },
    it: {
      title: "Desarrollo y Consultoría IT",
      subtitle: "Tu Socio Tecnológico Integral",
      description:
        "Somos tu aliado tecnológico que entrega soluciones integrales. Te acompañamos desde la consultoría y el asesoramiento hasta la implementación de soluciones digitales complejas. Especialistas en automatismos con Inteligencia Artificial y desarrollo de software administrativo de alta eficiencia.",
      icon: Code,
      color: "from-gray-700 to-gray-900",
      image: "/assets/it-responsible.jpg",
      subservices: [
        {
          name: "Consultoría IT Estratégica",
          description: "Asesoramiento experto para definir tu roadmap tecnológico",
          icon: FileText,
        },
        {
          name: "Automatismos con IA",
          description: "Implementación de inteligencia artificial para automatizar procesos complejos",
          icon: Brain,
        },
        {
          name: "Software Administrativo",
          description: "Desarrollo de sistemas de gestión de alta eficiencia y rendimiento",
          icon: Server,
        },
        {
          name: "Soluciones Digitales Complejas",
          description: "Implementación integral de tecnología para transformar tu negocio",
          icon: Workflow,
        },
      ],
      benefits: [
        "Acompañamiento desde la consultoría hasta la implementación",
        "Automatización inteligente que reduce costos operativos",
        "Software administrativo diseñado para tu empresa",
        "Innovación tecnológica aplicada a tu negocio",
      ],
    },
  };

  const currentService = servicesData[serviceId as keyof typeof servicesData] || servicesData.legal;
  const ServiceIcon = currentService.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${currentService.color} mb-6`}>
              <ServiceIcon size={32} />
            </div>
            <h1 className="mb-4">{currentService.title}</h1>
            <p className="text-xl text-gray-300 mb-6">{currentService.subtitle}</p>
            <p className="text-lg text-gray-400">{currentService.description}</p>
          </div>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="border-b bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto py-4">
            <button
              onClick={() => window.location.hash = "legal"}
              className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${serviceId === "legal" ? "border-accent text-accent" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              Asesoramiento Legal
            </button>
            <button
              onClick={() => window.location.hash = "it"}
              className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${serviceId === "it" ? "border-black text-black" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              Desarrollo y Consultoría IT
            </button>
            <button
              onClick={() => window.location.hash = "accounting"}
              className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${serviceId === "accounting" ? "border-accent text-accent" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              Consultoría Económica y Contable
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="mb-6">Servicios Especializados</h2>
              <div className="space-y-4">
                {currentService.subservices.map((subservice, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${currentService.color} flex-shrink-0`}>
                      <subservice.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h3>{subservice.name}</h3>
                      <p className="text-gray-600">{subservice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ServiceImage
                src={serviceImages[serviceId as keyof typeof serviceImages]?.transparent || currentService.image}
                alt={currentService.title}
                variant="transparent"
                size="large"
                className="object-contain max-h-[500px] w-auto bg-white rounded-lg p-4 shadow-lg"
              />
              <p className="mt-4 text-center text-gray-700 text-sm font-medium">
                {serviceId === "legal" && "Responsable: Juan Cruz"}
                {serviceId === "it" && (
                  <>
                    Responsable: Matias
                    <br />
                    <span className="text-xs text-gray-500">"Soluciones tecnológicas para tu empresa"</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-neutral-50 rounded-lg p-8 mb-16">
            <h2 className="mb-6 text-center">Beneficios Clave</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentService.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="text-accent flex-shrink-0" size={24} />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Solicita una Consulta Gratuita</CardTitle>
                <CardDescription className="text-base">
                  Complete el formulario y nuestro equipo se pondrá en contacto con usted en menos de 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input id="name" placeholder="Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" placeholder="Mi Empresa S.A." />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="juan@empresa.cl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+56 9 1234 5678" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Servicio de Interés</Label>
                    <Input id="service" value={currentService.title} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Cuéntenos sobre sus necesidades y cómo podemos ayudarle..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Enviar Consulta
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">¿Prefiere contactarnos directamente?</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a href="tel:+56912345678" className="flex items-center space-x-2 text-accent hover:text-accent/80">
                <Phone size={20} />
                <span>+56 9 1234 5678</span>
              </a>
              <a href="mailto:contacto@hhbc.cl" className="flex items-center space-x-2 text-accent hover:text-accent/80">
                <Mail size={20} />
                <span>contacto@hhbc.cl</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">¿Necesitas Otros Servicios?</h2>
          <p className="text-lg mb-8 text-gray-300">
            Explora nuestra gama completa de servicios profesionales
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("home")}
            className="bg-white text-black hover:bg-gray-100"
          >
            Ver Todos los Servicios
          </Button>
        </div>
      </section>
    </div>
  );
}
