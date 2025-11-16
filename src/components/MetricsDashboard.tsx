import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Calendar, Users, MousePointer, TrendingUp, Download, RefreshCw, Eye, EyeOff } from "lucide-react";
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

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [eventType, setEventType] = useState('all');
  const [authToken, setAuthToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Authentication - Use demo token for backend compatibility
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Updated to match the new admin login credentials
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      const demoToken = 'admin-demo-token-123';
      setAuthToken(demoToken);
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', demoToken);
      localStorage.setItem('user_role', 'admin');
      toast.success('Autenticación exitosa');
    } else {
      toast.error('Credenciales inválidas. Use admin/admin123');
    }
  };

  // Check for existing token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const userRole = localStorage.getItem('user_role');
    console.log('🔍 MetricsDashboard checking auth:', { storedToken, userRole });
    
    if (storedToken && storedToken === 'admin-demo-token-123' && userRole === 'admin') {
      console.log('✅ MetricsDashboard authentication successful');
      setAuthToken(storedToken);
      setIsAuthenticated(true);
    } else {
      console.log('❌ MetricsDashboard authentication failed');
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && authToken) {
      console.log('📊 Fetching metrics data...');
      fetchMetrics();
      fetchContactRequests();
    }
  }, [isAuthenticated, authToken]);

  // Fetch metrics data
  const fetchMetrics = async () => {
    if (!isAuthenticated || !authToken) return;

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

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/metrics/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        toast.error('Error al cargar métricas');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Fetch contact requests
  const fetchContactRequests = async () => {
    if (!isAuthenticated || !authToken) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/contact/requests`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContactRequests(data.contact_requests);
      }
    } catch (error) {
      console.error('Error fetching contact requests:', error);
    }
  };

  // Update request status
  const updateRequestStatus = async (requestId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/contact/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (response.ok) {
        toast.success('Estado actualizado exitosamente');
        fetchContactRequests(); // Refresh the list
      } else {
        toast.error('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
      fetchContactRequests();
    }
  }, [isAuthenticated, authToken, dateRange, eventType]);

  // Prepare chart data
  const getEventTypeChartData = () => {
    if (!metrics?.events_by_type) return [];
    return Object.entries(metrics.events_by_type).map(([name, value]) => ({ name, value }));
  };

  const getDeviceChartData = () => {
    if (!metrics?.device_breakdown) return [];
    return Object.entries(metrics.device_breakdown).map(([name, value]) => ({ name, value }));
  };

  const getPageViewsChartData = () => {
    if (!metrics?.page_views) return [];
    return Object.entries(metrics.page_views).map(([name, value]) => ({ name, value }));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel de Métricas - Login</CardTitle>
            <CardDescription>Ingrese sus credenciales de administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Ingresar</Button>
            </form>
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="dateRange">Rango de Fechas</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="dateRange">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 90 días</SelectItem>
                    <SelectItem value="all">Todo el tiempo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="eventType">Tipo de Evento</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="eventType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los eventos</SelectItem>
                    <SelectItem value="page_view">Vistas de página</SelectItem>
                    <SelectItem value="contact_form_submit">Formularios de contacto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={fetchMetrics} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : metrics?.total_events || 0}
                  </p>
                </div>
                <MousePointer className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones Únicas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : metrics?.unique_sessions || 0}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : metrics?.unique_users || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Solicitudes de Contacto</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contactRequests.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getEventTypeChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getEventTypeChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getDeviceChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Page Views Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vistas por Página</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getPageViewsChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contactRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`}>
                          NORMAL
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {request.status === 'new' && (
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'in_progress')}
                            >
                              Procesar
                            </Button>
                          )}
                          {request.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'resolved')}
                            >
                              Resolver
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // View details functionality could be added here
                              toast.info('Función de detalles no implementada');
                            }}
                          >
                            Ver
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {contactRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay solicitudes de contacto
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}