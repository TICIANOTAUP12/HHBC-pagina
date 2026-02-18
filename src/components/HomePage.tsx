import { Button } from "./ui/button";
import { DarkBackgroundButton } from "./DarkBackgroundButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Scale, Code, Calculator, Users, Award, Shield, ArrowRight, Quote, TrendingUp, Lock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string, serviceId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const services = [
    {
      id: "legal",
      title: "Asesoramiento Legal Estratégico",
      description: "Seguro legal con suscripción mensual. Acceso a abogados de élite sin el costo de un departamento legal interno.",
      icon: Scale,
      color: "from-accent to-blue-500",
    },
    {
      id: "it",
      title: "Desarrollo y Consultoría IT",
      description: "Socio tecnológico integral. Automatismos con IA y desarrollo de software administrativo de alta eficiencia.",
      icon: Code,
      color: "from-gray-700 to-gray-900",
    },
    {
      id: "accounting",
      title: "Consultoría Económica y Contable",
      description: "Segunda opinión experta. Asesoramientos, revisiones contables y determinaciones síndico-contables seguras.",
      icon: Calculator,
      color: "from-accent to-blue-600",
    },
  ];

  const testimonials = [
    {
      name: "CChC",
      position: "Cámara Chilena de la Construcción",
      content: "El equipo de HHBC nos brindó asesoría legal estratégica y soluciones rápidas para nuestros desafíos gremiales.",
      avatar: "CChC",
    },
    {
      name: "Derco Valentini",
      position: "Gerencia Legal, Derco Valentini",
      content: "Excelente acompañamiento en temas legales y cumplimiento normativo. Muy recomendados por su profesionalismo.",
      avatar: "DV",
    },
    {
      name: "Cliente Confidencial",
      position: "Empresa del rubro industrial",
      content: "La consultoría de HHBC nos permitió optimizar procesos y resolver situaciones complejas con rapidez y confianza.",
      avatar: "CC",
    },
  ];

  const stats = [
    { icon: Users, value: "50+", label: "Empresas Chilenas Atendidas" },
    { icon: Award, value: "Innovación", label: "Enfoque Tecnológico" },
    { icon: Shield, value: "100%", label: "Confidencialidad y Seguridad" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758518729908-d4220a678d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGNvbnN1bHRpbmd8ZW58MXx8fHwxNzYyMjk2OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Professional consulting"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="mb-6">El Soporte que tu Empresa Necesita para Crecer</h1>
            <p className="text-xl mb-4 text-gray-300">
              Consultoría integral chilena especializada en Legal, IT y Contabilidad
            </p>
            <p className="text-lg mb-8 text-gray-400">
              Somos tu aliado estratégico. Ayudamos a PYMES, sindicatos y empresas con grandes flujos de trabajo 
              a crecer de manera segura, ordenada y correcta en todo Chile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate("contact")}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                Contactar Ahora
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <DarkBackgroundButton
                size="lg"
                onClick={() => onNavigate("services")}
              >
                Conoce Nuestros Servicios
              </DarkBackgroundButton>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 shadow-sm">
                  <stat.icon className="text-accent" size={24} />
                </div>
                <div>
                  <div className="text-black">{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">Nuestras Áreas de Servicio</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tres pilares fundamentales para entregar soluciones concretas a problemas específicos. 
              Expertos comprometidos con el desarrollo del mercado chileno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-accent/50 shadow-md bg-white hover:-translate-y-1"
                onClick={() => onNavigate("services", service.id)}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <service.icon className="text-white" size={28} />
                  </div>
                  {/* Imagen personalizada para IT y Economía */}
                  {service.id === "it" && (
                    <div className="flex justify-center mb-2">
                      <img src="/assets/it-profile.jpg" alt="IT Responsable" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  {service.id === "accounting" && (
                    <div className="flex justify-center mb-2">
                      <img src="/assets/accounting-profile.jpg" alt="Economía Responsable" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="group-hover:text-accent p-0">
                    Más información
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6 text-gray-900">Innovación y Experiencia al Servicio de Chile</h2>
              <p className="text-lg mb-4 text-gray-700">
                HHBC Consulting Group es una empresa chilena de consultoría integral, nueva e innovadora, 
                con un fuerte enfoque en fomentar y desarrollar el mercado nacional.
              </p>
              <p className="text-lg mb-6 text-gray-700">
                Nuestra misión es ser el soporte necesario para que las empresas puedan crecer de manera 
                segura, ordenada y correcta. Nos especializamos en PYMES, el sector sindical y empresas 
                con grandes flujos de trabajo en todo el territorio chileno.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 mt-1">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <div>
                    <h4>Soluciones Concretas</h4>
                    <p className="text-gray-600">Enfoque práctico para resolver problemas específicos de tu empresa</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 mt-1">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <div>
                    <h4>Cobertura Nacional</h4>
                    <p className="text-gray-600">Presencia y compromiso con empresas en todo Chile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 mt-1">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <div>
                    <h4>Tecnología de Vanguardia</h4>
                    <p className="text-gray-600">Innovación con IA y automatización para maximizar eficiencia</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-blue-600/20 rounded-lg transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2MjIxNTg0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Business team meeting"
                className="rounded-lg shadow-2xl w-full relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empresas chilenas que confían en HHBC para su crecimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="relative shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 border-blue-100/50 bg-white"
              >
                <CardHeader>
                  <Quote className="text-accent/20 mb-4" size={32} />
                  <CardDescription className="text-base text-gray-700 italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-600 text-white shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">¿Listo para Hacer Crecer tu Empresa?</h2>
          <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
            Únete a las empresas chilenas que ya confían en nosotros. Contacta con nuestro equipo de expertos 
            y descubre cómo podemos ayudarte a crecer de manera segura, ordenada y correcta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate("contact")}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              Contactar Ahora
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <DarkBackgroundButton
              size="lg"
              onClick={() => onNavigate("services")}
            >
              Ver Todos los Servicios
            </DarkBackgroundButton>
          </div>
        </div>
      </section>
    </div>
  );
}