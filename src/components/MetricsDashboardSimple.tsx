import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Calendar, Users, MousePointer, TrendingUp, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";

interface MetricData {
  total_events: number;
  events_by_type: Record<string, number>;
  page_views: Record<string, number>;
  unique_sessions: number;
  unique_users: number;
  device_breakdown: Record<string, number>;
  country_breakdown: Record<string, number>;
}

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  company?: string;
  phone?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function MetricsDashboardSimple() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [eventType, setEventType] = useState('all');

  // Fetch metrics data - simplified authentication
  const fetchMetrics = async () => {
    const authToken = localStorage.getItem('admin_token');
    const userRole = localStorage.getItem('user_role');
    
    console.log('📊 Fetching metrics with auth:', { authToken, userRole });
    
    if (!authToken || authToken !== 'admin-demo-token-123' || userRole !== 'admin') {
      toast.error('No autorizado', { description: 'Debe iniciar sesión como administrador' });
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange !== 'all') {
        const endDate = new Date();
        const startDate = new Date();
        
        switch (dateRange) {
          case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(endDate.getDate() - 90);
            break;
        }
        
        params.append('start_date', startDate.toISOString());
        params.append('end_date', endDate.toISOString());
      }
      
      if (eventType !== 'all') {
        params.append('event_type', eventType);
      }

      const response = await fetch(`/metrics/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener métricas');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Error', { description: 'No se pudieron cargar las métricas' });
      // Use mock data for demo
      setMetrics({
        total_events: 1250,
        events_by_type: {
          'page_view': 800,
          'contact_form_submit': 45,
          'button_click': 405
        },
        page_views: {
          '/': 450,
          '/services': 320,
          '/contact': 180,
          '/about': 150
        },
        unique_sessions: 890,
        unique_users: 756,
        device_breakdown: {
          'desktop': 650,
          'mobile': 480,
          'tablet': 120
        },
        country_breakdown: {
          'CL': 1150,
          'US': 75,
          'AR': 25
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch contact requests
  const fetchContactRequests = async () => {
    const authToken = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch('/contact/requests', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener solicitudes');
      }

      const data = await response.json();
      setContactRequests(data);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      // Use mock data for demo
      setContactRequests([
        {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan@empresa.cl',
          subject: 'Consulta Legal',
          message: 'Necesito asesoría sobre contratos laborales',
          status: 'new',
          created_at: '2024-01-15T10:30:00Z',
          company: 'Empresa ABC',
          phone: '+56912345678'
        },
        {
          id: 2,
          name: 'María González',
          email: 'maria@negocio.cl',
          subject: 'Desarrollo Software',
          message: 'Quiero automatizar procesos en mi empresa',
          status: 'in_progress',
          created_at: '2024-01-14T14:20:00Z',
          company: 'Negocio XYZ',
          phone: '+56987654321'
        }
      ]);
    }
  };

  // Update contact request status
  const updateContactStatus = async (id: number, newStatus: ContactRequest['status']) => {
    const authToken = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch(`/contact/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      toast.success('Estado actualizado', { description: 'El estado del contacto fue actualizado' });
      fetchContactRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error', { description: 'No se pudo actualizar el estado' });
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    console.log('🚀 MetricsDashboardSimple iniciando...');
    fetchMetrics();
    fetchContactRequests();
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    if (metrics) {
      fetchMetrics();
    }
  }, [dateRange, eventType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando Dashboard...</h2>
          <p className="text-gray-600">Obteniendo métricas y datos de contacto</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error de Autenticación</CardTitle>
            <CardDescription>No tienes permisos para ver este dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Métricas y Análisis</h1>
          <p className="text-gray-600">Monitoree el rendimiento y las interacciones del sitio web</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.total_events}</p>
                </div>
                <MousePointer className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones Únicas</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.unique_sessions}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Únicos</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.unique_users}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Formularios</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.events_by_type.contact_form_submit || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Requests Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Solicitudes de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{request.name}</h4>
                      <p className="text-sm text-gray-600">{request.email}</p>
                      {request.company && <p className="text-sm text-gray-500">{request.company}</p>}
                    </div>
                    <Badge 
                      variant={request.status === 'new' ? 'default' : 
                              request.status === 'in_progress' ? 'secondary' :
                              request.status === 'resolved' ? 'success' : 'outline'}
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2"><strong>Asunto:</strong> {request.subject}</p>
                  <p className="text-sm mb-3">{request.message}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={request.status === 'new' ? 'default' : 'outline'}
                      onClick={() => updateContactStatus(request.id, 'in_progress')}
                      disabled={request.status !== 'new'}
                    >
                      En Progreso
                    </Button>
                    <Button
                      size="sm"
                      variant={request.status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => updateContactStatus(request.id, 'resolved')}
                      disabled={request.status === 'resolved' || request.status === 'closed'}
                    >
                      Resolver
                    </Button>
                    <Button
                      size="sm"
                      variant={request.status === 'closed' ? 'default' : 'outline'}
                      onClick={() => updateContactStatus(request.id, 'closed')}
                      disabled={request.status === 'closed'}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}