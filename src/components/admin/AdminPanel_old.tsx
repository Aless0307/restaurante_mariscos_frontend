import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { EditCategoryModal } from './EditCategoryModal';
import { EditItemModal } from './EditItemModal';
import SimpleImageManager from './SimpleImageManager';
import { RestauranteInfoEditor } from './RestauranteInfoEditor';
import { 
  Users, 
  Clock, 
  ChefHat, 
  Image, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  EyeOff,
  DollarSign,
  BarChart3,
  TrendingUp,
  Store,
  Crown,
  Shield,
  Timer,
  User,
  Bell,
  Search,
  Filter,
  RefreshCw,
  Activity
} from 'lucide-react';

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
}

interface Categoria {
  id: string;
  _id: string;
  nombre: string;
  color: string;
  icono: string;
  orden: number;
  activo: boolean;
  imagen_url_original?: string;
  items?: Item[];
  total_items?: number;
}

interface Item {
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: boolean;
}

interface Usuario {
  nombre: string;
  email: string;
  es_admin: boolean;
}

interface DecodedToken {
  exp: number;
  sub: string;
}

export function AdminPanel({ token, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  // Estados para modales
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [editingItem, setEditingItem] = useState<{ item: Item; categoryId: string; itemIndex: number } | null>(null);
  const [selectedCategoryForItems, setSelectedCategoryForItems] = useState<string | null>(null);

  const apiHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Función para decodificar JWT
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  // Calcular tiempo restante de sesión
  useEffect(() => {
    const updateTimeRemaining = () => {
      const decoded = decodeToken(token);
      if (!decoded) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      if (timeLeft <= 0) {
        setTimeRemaining('Expirado');
        return;
      }

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        setTimeRemaining(`${hours}h ${remainingMinutes}m`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      
      // Cargar perfil del usuario
      const perfilResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth-mongo/profile`, {
        headers: apiHeaders,
      });
      
      if (perfilResponse.status === 401) {
        console.log('🔴 Token expirado en cargarDatosIniciales');
        onLogout();
        return;
      }
      
      if (perfilResponse.ok) {
        const perfilData = await perfilResponse.json();
        setUsuario(perfilData);
      }

      // Cargar categorías
      const categoriasResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`, {
        headers: apiHeaders,
      });
      
      if (categoriasResponse.status === 401) {
        console.log('🔴 Token expirado en cargarDatosIniciales');
        onLogout();
        return;
      }
      
      if (categoriasResponse.ok) {
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      console.log('🔄 Recargando categorías...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`, {
        headers: apiHeaders,
      });
      
      if (response.status === 401) {
        console.log('🔴 Token expirado en cargarCategorias');
        onLogout();
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Categorías cargadas:', data.length, 'categorías');
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleCategoryChange = () => {
    cargarCategorias();
  };

  const handleItemChange = () => {
    console.log('🔄 Recargando categorías después de cambio en item...');
    cargarCategorias();
  };

  const openEditCategory = (categoria: Categoria) => {
    setEditingCategory(categoria);
    setShowCategoryModal(true);
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const openEditItem = (item: Item, categoryId: string) => {
    const categoryIndex = categorias.findIndex(cat => cat.id === categoryId);
    const itemIndex = categorias[categoryIndex]?.items?.findIndex(i => i.nombre === item.nombre) || 0;
    setEditingItem({ item, categoryId, itemIndex });
    setShowItemModal(true);
  };

  const openAddItem = (categoryId: string) => {
    setSelectedCategoryForItems(categoryId);
    setEditingItem(null);
    setShowItemModal(true);
  };

  const eliminarCategoria = async (categoriaId: string, categoriaNombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoriaNombre}"?\n\nEsta acción eliminará la categoría y todos sus platillos. No se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoriaId}`, {
        method: 'DELETE',
        headers: apiHeaders,
      });

      if (response.status === 401) {
        console.log('🔴 Token expirado en eliminarCategoria');
        onLogout();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar categoría: ${response.status} - ${errorText}`);
      }

      await cargarCategorias();
      console.log('✅ Categoría eliminada exitosamente:', categoriaNombre);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al eliminar la categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const eliminarItem = async (categoriaId: string, itemNombre: string, itemIndex: number) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${itemNombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoriaId}/items/${encodeURIComponent(itemNombre)}?item_index=${itemIndex}`, {
        method: 'DELETE',
        headers: apiHeaders,
      });

      if (response.status === 401) {
        console.log('🔴 Token expirado en eliminarItem');
        onLogout();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar item: ${response.status} - ${errorText}`);
      }

      await cargarCategorias();
      console.log('✅ Item eliminado exitosamente:', itemNombre);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al eliminar el platillo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Panel Principal', 
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Resumen general del restaurante'
    },
    { 
      id: 'menu', 
      label: 'Mi Menú', 
      icon: <ChefHat className="w-5 h-5" />,
      description: 'Gestiona tus categorías y platillos'
    },
    { 
      id: 'imagenes', 
      label: 'Mis Fotos', 
      icon: <Image className="w-5 h-5" />,
      description: 'Sube y organiza las imágenes'
    },
    { 
      id: 'info', 
      label: 'Mi Restaurante', 
      icon: <Store className="w-5 h-5" />,
      description: 'Información de contacto y datos'
    },
  ];

  const totalItems = categorias.reduce((total, cat) => total + (cat.total_items || cat.items?.length || 0), 0);
  const categoriasActivas = categorias.filter(cat => cat.activo).length;
  const promedioItemsPorCategoria = categorias.length > 0 ? Math.round(totalItems / categorias.length) : 0;

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Bienvenida Ultra Moderna */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-orange-500/20"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
              ¡Bienvenido de vuelta!
            </h2>
            <p className="text-slate-300 text-xl mb-4">
              Hola <span className="font-bold text-emerald-400">{usuario?.nombre || 'Administrador'}</span>, 
              aquí puedes gestionar tu restaurante fácilmente
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-500/20 rounded-xl px-4 py-2 border border-emerald-500/30">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Sistema activo</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/20 rounded-xl px-4 py-2 border border-blue-500/30">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Sesión: {timeRemaining}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-500 to-orange-500 rounded-2xl p-8 shadow-xl">
                <ChefHat className="w-20 h-20 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Ultra Modernas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta de Categorías */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <Card className="relative bg-white/80 backdrop-blur-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Categorías</p>
                <p className="text-4xl font-bold text-slate-800 mb-1">{categorias.length}</p>
                <p className="text-sm text-slate-500">Secciones de tu menú</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Platillos */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <Card className="relative bg-white/80 backdrop-blur-xl border border-green-200 hover:border-green-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-1">Platillos</p>
                <p className="text-4xl font-bold text-slate-800 mb-1">{totalItems}</p>
                <p className="text-sm text-slate-500">Total en tu menú</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Activas */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <Card className="relative bg-white/80 backdrop-blur-xl border border-orange-200 hover:border-orange-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-1">Activas</p>
                <p className="text-4xl font-bold text-slate-800 mb-1">{categoriasActivas}</p>
                <p className="text-sm text-slate-500">Categorías visibles</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Promedio */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <Card className="relative bg-white/80 backdrop-blur-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">Promedio</p>
                <p className="text-4xl font-bold text-slate-800 mb-1">{promedioItemsPorCategoria}</p>
                <p className="text-sm text-slate-500">Platillos por categoría</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Acciones Rápidas Ultra Modernas */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <Card className="relative bg-white/80 backdrop-blur-xl border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-all duration-300 rounded-3xl shadow-xl">
          <CardContent className="p-10 text-center">
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">¿Quieres agregar algo nuevo?</h3>
              <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                Empieza creando una nueva categoría como <span className="font-semibold text-emerald-600">"Mariscos"</span>, 
                <span className="font-semibold text-blue-600"> "Carnes"</span> o 
                <span className="font-semibold text-orange-600"> "Bebidas"</span>
              </p>
            </div>
            <button 
              onClick={() => openAddCategory()}
              className="group relative bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-10 py-5 rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 border border-emerald-400"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
                <span>Crear Nueva Categoría</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Resumen del menú */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-gray-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <Card className="relative bg-white/80 backdrop-blur-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 rounded-3xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-3xl border-b border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Tu Menú Actual</h3>
                <p className="text-slate-600">Vista rápida de tus categorías más importantes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {categorias.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">¡Aún no tienes categorías!</h4>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                  Comienza creando tu primera categoría para organizar tus platillos
                </p>
                <button 
                  onClick={() => openAddCategory()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                >
                  Crear Mi Primera Categoría
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.slice(0, 6).map((categoria) => (
                  <div key={categoria.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                            {categoria.icono}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{categoria.nombre}</h4>
                            <p className="text-sm text-slate-500">{categoria.total_items || categoria.items?.length || 0} platillos</p>
                          </div>
                        </div>
                        {categoria.activo ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" title="Visible en el menú">
                            <Eye className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" title="Oculta del menú">
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditCategory(categoria)}
                          className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 px-4 py-3 rounded-xl text-sm hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-medium"
                        >
                          <Edit3 className="w-4 h-4 inline mr-2" />
                          Editar
                        </button>
                        <button
                          onClick={() => openAddItem(categoria.id || categoria._id)}
                          className="flex-1 bg-gradient-to-r from-green-50 to-green-100 text-green-600 px-4 py-3 rounded-xl text-sm hover:from-green-100 hover:to-green-200 transition-all duration-200 font-medium"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Platillos
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMenuManagement = () => (
    <div className="space-y-8">
      {/* Header Ultra Moderno */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">Gestiona Tu Menú</h3>
                <p className="text-slate-600 text-lg">
                 Aquí puedes editar categorías, agregar platillos y establecer precios
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-600 font-medium">{categorias.length} categorías</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600 font-medium">{totalItems} platillos</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => openAddCategory()}
              className="group bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-emerald-400"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
                <span>Nueva Categoría</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Ultra Moderno de Categorías */}
      {categorias.length === 0 ? (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <Card className="relative border-2 border-dashed border-orange-300 hover:border-orange-400 transition-all duration-300 rounded-3xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-16 text-center">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <ChefHat className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-4">¡Comienza a crear tu menú!</h4>
              <p className="text-slate-600 text-lg mb-10 max-w-lg mx-auto">
                Las categorías te ayudan a organizar tus platillos. Por ejemplo: 
                <span className="font-semibold text-emerald-600"> "Entradas"</span>, 
                <span className="font-semibold text-blue-600"> "Platos Principales"</span>, 
                <span className="font-semibold text-orange-600"> "Bebidas"</span>
              </p>
              <button 
                onClick={() => openAddCategory()}
                className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white px-12 py-5 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 border border-orange-400"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-6 h-6" />
                  <span>Crear Mi Primera Categoría</span>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-slate-300 transform group-hover:scale-105 rounded-3xl overflow-hidden">
                {/* Header de la tarjeta */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">{categoria.icono}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-slate-800">{categoria.nombre}</h4>
                          <p className="text-sm text-slate-500 font-medium">
                            {categoria.total_items || categoria.items?.length || 0} platillos disponibles
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {categoria.activo ? (
                          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-xl text-xs font-bold flex items-center border border-green-200">
                            <Eye className="w-3 h-3 mr-1" />
                            VISIBLE
                          </span>
                        ) : (
                          <span className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold flex items-center border border-gray-200">
                            <EyeOff className="w-3 h-3 mr-1" />
                            OCULTA
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}" y todos sus platillos?`)) {
                              eliminarCategoria(categoria.id || categoria._id, categoria.nombre);
                            }
                          }}
                          className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center justify-center border border-red-200"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                
                <CardContent className="p-6">
                  {/* Lista de platillos moderna */}
                  <div className="max-h-72 overflow-y-auto mb-6 custom-scrollbar">
                    {categoria.items && categoria.items.length > 0 ? (
                      <div className="space-y-3">
                        {categoria.items.map((item, index) => (
                          <div 
                            key={`${categoria.id}-${index}`} 
                            className="group bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-slate-200 hover:border-blue-300"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0 mr-4">
                                <h5 className="font-bold text-slate-800 truncate text-lg">{item.nombre}</h5>
                                {item.descripcion && (
                                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.descripcion}</p>
                                )}
                                <div className="mt-2 flex items-center space-x-2">
                                  <span className="text-2xl font-bold text-emerald-600">${item.precio}</span>
                                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                    item.disponible 
                                      ? 'bg-green-100 text-green-700 border border-green-200' 
                                      : 'bg-red-100 text-red-700 border border-red-200'
                                  }`}>
                                    {item.disponible ? 'Disponible' : 'No disponible'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openEditItem(item, categoria.id || categoria._id);
                                  }}
                                  className="w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200 flex items-center justify-center border border-blue-200"
                                  title="Editar platillo"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (window.confirm(`¿Eliminar "${item.nombre}"?`)) {
                                      eliminarItem(categoria.id || categoria._id, item.nombre, index);
                                    }
                                  }}
                                  className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 flex items-center justify-center border border-red-200"
                                  title="Eliminar platillo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <ChefHat className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm mb-2">
                          {categoria.total_items && categoria.total_items > 0 
                            ? `${categoria.total_items} platillos disponibles` 
                            : 'Sin platillos aún'
                          }
                        </p>
                        <p className="text-slate-400 text-xs">Agrega platillos para completar esta categoría</p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción modernos */}
                  <div className="flex space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => openEditCategory(categoria)}
                      className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-xl text-sm hover:from-blue-100 hover:to-blue-200 transition-all duration-300 font-semibold border border-blue-200 flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar Categoría</span>
                    </button>
                    <button
                      onClick={() => openAddItem(categoria.id || categoria._id)}
                      className="flex-1 bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 px-4 py-3 rounded-xl text-sm hover:from-emerald-100 hover:to-green-200 transition-all duration-300 font-semibold border border-emerald-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Platillo</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
                        }
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Botones de acción */}
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditCategory(categoria);
                    }}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openAddItem(categoria.id || categoria._id);
                    }}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Platillo</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Cargando tu panel...</h3>
          <p className="text-gray-600">Preparando todo para ti</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
      </div>
      {/* Header Ultra Moderno */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo y Título */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-green-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-200">
                  <ChefHat className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Panel de Administración
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Restaurante Darío</span>
                  </div>
                  <div className="w-1 h-4 bg-slate-600 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">En línea</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Panel de Usuario y Controles */}
            <div className="flex items-center space-x-6">
              {/* Información del Usuario */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                        <Shield className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-semibold text-sm">{usuario?.nombre || 'Administrador'}</p>
                        <div className="px-2 py-1 bg-emerald-500 rounded-lg">
                          <span className="text-white text-xs font-bold">ADMIN</span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs">{usuario?.email || 'admin@restaurante.com'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Timer de Sesión */}
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase font-medium">Tiempo de sesión</p>
                      <p className="text-white font-bold text-lg">{timeRemaining || '...'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de Acción */}
              <div className="flex items-center space-x-3">
                {/* Botón de Notificaciones */}
                <button className="relative w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl group">
                  <Bell className="w-5 h-5 text-slate-400 group-hover:text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                
                {/* Botón de Actualizar */}
                <button 
                  onClick={() => cargarDatosIniciales()}
                  className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl group"
                  title="Actualizar datos"
                >
                  <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:rotate-180 transition-all duration-300" />
                </button>
                
                {/* Botón de Cerrar Sesión */}
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                      onLogout();
                    }
                  }}
                  className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-400"
                  title="Cerrar sesión y regresar a la página principal"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline font-semibold">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Navegación Ultra Moderna */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-3 border border-slate-200">
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-3 py-5 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-orange-500 text-white shadow-xl border border-emerald-400'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 border border-transparent hover:border-slate-200 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === tab.id 
                      ? 'bg-white/20' 
                      : 'bg-slate-100'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="hidden sm:inline text-lg">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Descripción Mejorada */}
          <div className="mt-6 text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 shadow-lg">
              <p className="text-slate-700 text-lg font-medium">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido Ultra Moderno */}
        <div className="transition-all duration-500">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'menu' && renderMenuManagement()}
          {activeTab === 'imagenes' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Gestión de Imágenes</h2>
                </div>
                <p className="text-slate-600">Administra las imágenes del restaurante de forma fácil y eficiente</p>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
              </div>
              <SimpleImageManager />
            </div>
          )}
          {activeTab === 'info' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Información del Restaurante</h2>
                    <p className="text-blue-100 text-lg">Personaliza los datos principales de tu restaurante</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Store className="w-5 h-5 text-cyan-200" />
                      <span className="text-cyan-200 font-medium">Configuración</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-1">Completa</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-cyan-200" />
                      <span className="text-cyan-200 font-medium">Vista Previa</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-1">En Vivo</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-cyan-200" />
                      <span className="text-cyan-200 font-medium">Estado</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-1">Activo</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <RestauranteInfoEditor token={token} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <EditCategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onCategoryChange={handleCategoryChange}
      />

      <EditItemModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(null);
          setSelectedCategoryForItems(null);
        }}
        item={editingItem?.item || null}
        categoryId={editingItem?.categoryId || selectedCategoryForItems || ''}
        categorias={categorias}
        onItemChange={handleItemChange}
      />
    </div>
  );
}