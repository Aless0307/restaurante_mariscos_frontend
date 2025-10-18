import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  TrendingUp,
  Store,
  Crown,
  Shield,
  Timer,
  User,
  Bell,
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

// Sistema de Colores Modular para AdminPanel
// ALINEADO CON LA PÁGINA PRINCIPAL DEL RESTAURANTE
const AdminTheme = {
  // COLORES PRINCIPALES - Combinan con la página del cliente
  primary: {
    // Verde principal (como en la página del cliente)
    green: {
      50: '#f0fdf4',   // Fondos muy claros
      100: '#dcfce7',  // Fondos claros - texto sobre fondos oscuros
      200: '#bbf7d0',  // Bordes suaves
      300: '#86efac',  // Elementos interactivos
      400: '#4ade80',  // Verde principal del cliente (green-400)
      500: '#22c55e',  // Verde principal fuerte (green-500)
      600: '#16a34a',  // Verde oscuro (green-600)
      700: '#15803d',  // Textos importantes
      800: '#166534',  // Textos oscuros
      900: '#14532d',  // Textos muy oscuros
    },
    // Naranja complementario (como en la página del cliente)
    orange: {
      50: '#fff7ed',   // Fondos muy claros
      100: '#ffedd5',  // Fondos claros
      200: '#fed7aa',  // Bordes suaves
      300: '#fdba74',  // Elementos interactivos
      400: '#fb923c',  // Naranja principal del cliente (orange-400)
      500: '#f97316',  // Naranja principal fuerte (orange-500)
      600: '#ea580c',  // Naranja oscuro (orange-600)
      700: '#c2410c',  // Textos importantes
      800: '#9a3412',  // Textos oscuros
      900: '#7c2d12',  // Textos muy oscuros
    },
    // Colores de acento manteniendo la armonía
    red: {
      400: '#f87171',  // Elementos de alerta suaves
      500: '#ef4444',  // Alertas y errores
      600: '#dc2626',  // Botones de acción crítica
      700: '#b91c1c',  // Textos de error
      800: '#991b1b',  // Fondos de error
      900: '#7f1d1d',  // Textos de error oscuros
    },
    amber: {
      100: '#fef3c7',  // Textos claros sobre fondos oscuros
      200: '#fde68a',  // Fondos de notificación
      300: '#fcd34d',  // Texto destacado
      400: '#fbbf24',  // Badges importantes
      500: '#f59e0b',  // Elementos de advertencia
      600: '#d97706',  // Iconos activos
      700: '#b45309',  // Textos de advertencia
      800: '#92400e',  // Fondos de advertencia
      900: '#78350f',  // Textos oscuros
    }
  },
  
  // ESTADOS DEL SISTEMA
  status: {
    success: {
      100: '#dcfce7',  // Fondos de éxito claros
      300: '#86efac',  // Texto de éxito claro
      500: '#22c55e',  // Iconos y elementos de éxito
      600: '#16a34a',  // Botones de éxito
      700: '#15803d',  // Texto de éxito
      800: '#166534',  // Fondos de éxito oscuros
      900: '#14532d',  // Texto de éxito muy oscuro
    },
    info: {
      100: '#dbeafe',  // Fondos informativos
      500: '#3b82f6',  // Elementos informativos
      600: '#2563eb',  // Botones informativos
      700: '#1d4ed8',  // Texto informativo
    },
    warning: {
      100: '#fef3c7',  // Fondos de advertencia
      500: '#f59e0b',  // Elementos de advertencia
    },
    error: {
      100: '#fee2e2',  // Fondos de error claros
      500: '#ef4444',  // Elementos de error
      600: '#dc2626',  // Botones de error
    }
  },
  
  // COLORES NEUTROS
  neutral: {
    white: '#ffffff',  // Blanco puro - texto sobre fondos oscuros, iconos
    slate: {
      50: '#f8fafc',   // Fondos muy claros
      100: '#f1f5f9',  // Fondos claros
      200: '#e2e8f0',  // Bordes suaves
      300: '#cbd5e1',  // Bordes
      400: '#94a3b8',  // Texto secundario
      500: '#64748b',  // Texto normal
      600: '#475569',  // Texto destacado
      700: '#334155',  // Texto importante
      800: '#1e293b',  // Texto muy oscuro
      900: '#0f172a',  // Texto máximo contraste
    }
  }
};

/* 
  GUÍA DE USO:
  
  1. Para cambiar todos los colores naranjas del tema:
     Modifica los valores en AdminTheme.primary.orange
  
  2. Para cambiar colores de éxito/error:
     Modifica AdminTheme.status.success o AdminTheme.status.error
  
  3. Para aplicar un color:
     style={{color: AdminTheme.primary.orange[700]}}
     style={{backgroundColor: AdminTheme.primary.orange[50]}}
  
  4. Los números más bajos (50, 100) son más claros
     Los números más altos (800, 900) son más oscuros
  
  5. Mantén siempre el contraste adecuado:
     - Texto claro (100-300) sobre fondos oscuros (700-900)
     - Texto oscuro (700-900) sobre fondos claros (50-200)
*/

export function AdminPanel({ token, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const timeDisplayRef = useRef<HTMLParagraphElement>(null);
  
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

  // Calcular tiempo restante de sesión (optimizado para no causar re-renders)
  useEffect(() => {
    const updateTimeRemaining = () => {
      const decoded = decodeToken(token);
      if (!decoded) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      let displayTime: string;
      if (timeLeft <= 0) {
        displayTime = 'Expirado';
      } else {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          displayTime = `${hours}h ${remainingMinutes}m`;
        } else {
          displayTime = `${minutes}m ${seconds}s`;
        }
      }
      
      // Actualizar directamente el DOM para evitar re-renders
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = displayTime;
      }
      
      // Solo actualizamos el estado una vez al inicio
      if (!timeRemaining) {
        setTimeRemaining(displayTime);
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
      setError(null);
      console.log('🔄 Cargando datos iniciales del panel de administración...');
      
      // Cargar perfil del usuario usando el endpoint correcto de auth-mongo
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
        console.log('✅ Perfil cargado:', perfilData);
        setUsuario({
          nombre: perfilData.nombre || perfilData.email || 'admin',
          email: perfilData.email || 'admin@restaurante.com',
          es_admin: perfilData.es_admin || true
        });
      } else {
        console.log('⚠️ No se pudo cargar el perfil de usuario');
        const errorText = await perfilResponse.text();
        console.error('❌ Error perfil:', errorText);
        setError(`Error cargando perfil: ${perfilResponse.status}`);
      }

      // Cargar categorías usando el endpoint correcto de admin
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
        console.log('✅ Categorías cargadas:', categoriasData.length, 'categorías');
        setCategorias(categoriasData);
      } else {
        console.log('⚠️ No se pudieron cargar las categorías');
        const errorText = await categoriasResponse.text();
        console.error('❌ Error categorías:', errorText);
        setError(`Error cargando categorías: ${categoriasResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
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
        console.log('✅ Categorías recargadas:', data.length, 'categorías');
        setCategorias(data);
      } else {
        console.log('⚠️ Error al recargar categorías:', response.status);
      }
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
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
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoriaNombre}"?`)) {
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

      if (response.ok) {
        await cargarCategorias();
        console.log('✅ Categoría eliminada exitosamente:', categoriaNombre);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarItem = async (categoriaId: string, itemNombre: string, itemIndex: number) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${itemNombre}"?`)) {
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

      if (response.ok) {
        await cargarCategorias();
        console.log('✅ Item eliminado exitosamente:', itemNombre);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Panel Principal', 
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Resumen general del restaurante y estadísticas clave'
    },
    { 
      id: 'menu', 
      label: 'Mi Menú', 
      icon: <ChefHat className="w-5 h-5" />,
      description: 'Gestiona tus categorías y platillos de forma sencilla'
    },
    { 
      id: 'imagenes', 
      label: 'Mis Fotos', 
      icon: <Image className="w-5 h-5" />,
      description: 'Sube y organiza las imágenes de tu restaurante'
    },
    { 
      id: 'info', 
      label: 'Mi Restaurante', 
      icon: <Store className="w-5 h-5" />,
      description: 'Información de contacto y configuración general'
    },
  ];

  const totalItems = categorias.reduce((total, cat) => total + (cat.total_items || cat.items?.length || 0), 0);
  const categoriasActivas = categorias.filter(cat => cat.activo).length;
  const promedioItemsPorCategoria = categorias.length > 0 ? Math.round(totalItems / categorias.length) : 0;

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Bienvenida Elegante y Refinada */}
      <div 
        className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-300 p-8"
        style={{ backgroundColor: '#1e293b' }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold" style={{ color: '#ffffff' }}>
              Bienvenido de vuelta
            </h2>
            <p className="text-lg max-w-md" style={{ color: '#e5e7eb' }}>
              Hola <span className="font-semibold" style={{ color: '#ffffff' }}>{usuario?.nombre || 'Administrador'}</span>, 
              gestiona tu restaurante de manera eficiente
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2 rounded-xl px-4 py-2" style={{ backgroundColor: '#059669' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#86efac' }}></div>
                <span className="font-medium text-sm" style={{ color: '#ffffff' }}>Sistema activo</span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl px-4 py-2" style={{ backgroundColor: '#2563eb' }}>
                <Clock className="w-4 h-4" style={{ color: '#93c5fd' }} />
                <span className="font-medium text-sm" style={{ color: '#ffffff' }}>Sesión: {timeRemaining}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div 
              className="w-20 h-20 rounded-2xl border flex items-center justify-center"
              style={{ backgroundColor: '#374151', borderColor: '#4b5563' }}
            >
              <ChefHat className="w-10 h-10" style={{ color: '#ffffff' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Ultra Modernas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Tarjeta de Categorías - Refinada */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" style={{
            background: `linear-gradient(to right, ${AdminTheme.primary.green[300]}, ${AdminTheme.primary.orange[300]})`
          }}></div>
          <Card className="relative bg-white backdrop-blur-xl border hover:border-slate-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-lg" style={{borderColor: AdminTheme.neutral.slate[200]}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{
                  background: `linear-gradient(135deg, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`
                }}>
                  <ChefHat className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-1" style={{color: AdminTheme.neutral.slate[600]}}>Categorías</p>
                <p className="text-3xl font-bold mb-1" style={{color: AdminTheme.neutral.slate[800]}}>{categorias.length}</p>
                <p className="text-sm" style={{color: AdminTheme.neutral.slate[500]}}>Secciones de tu menú</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Platillos - Refinada */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" style={{
            background: `linear-gradient(to right, ${AdminTheme.primary.orange[300]}, ${AdminTheme.primary.green[300]})`
          }}></div>
          <Card className="relative bg-white backdrop-blur-xl border hover:border-slate-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-lg" style={{borderColor: AdminTheme.neutral.slate[200]}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{
                  background: `linear-gradient(135deg, ${AdminTheme.primary.orange[500]}, ${AdminTheme.primary.green[500]})`
                }}>
                  <DollarSign className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-1" style={{color: AdminTheme.neutral.slate[600]}}>Platillos</p>
                <p className="text-3xl font-bold mb-1" style={{color: AdminTheme.neutral.slate[800]}}>{totalItems}</p>
                <p className="text-sm" style={{color: AdminTheme.neutral.slate[500]}}>Total en tu menú</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Activas - Refinada */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" style={{
            background: `linear-gradient(to right, ${AdminTheme.status.success[300]}, ${AdminTheme.primary.green[300]})`
          }}></div>
          <Card className="relative bg-white backdrop-blur-xl border hover:border-slate-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-lg" style={{borderColor: AdminTheme.neutral.slate[200]}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{
                  backgroundColor: AdminTheme.status.success[500]
                }}>
                  <Eye className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-1" style={{color: AdminTheme.neutral.slate[600]}}>Activas</p>
                <p className="text-3xl font-bold mb-1" style={{color: AdminTheme.neutral.slate[800]}}>{categoriasActivas}</p>
                <p className="text-sm" style={{color: AdminTheme.neutral.slate[500]}}>Categorías visibles</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de Promedio - Refinada */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" style={{
            background: `linear-gradient(to right, ${AdminTheme.primary.orange[400]}, ${AdminTheme.primary.red[400]})`
          }}></div>
          <Card className="relative bg-white backdrop-blur-xl border hover:border-slate-300 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-lg" style={{borderColor: AdminTheme.neutral.slate[200]}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{
                  backgroundColor: AdminTheme.primary.red[500]
                }}>
                  <TrendingUp className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-1" style={{color: AdminTheme.neutral.slate[600]}}>Promedio</p>
                <p className="text-3xl font-bold mb-1" style={{color: AdminTheme.neutral.slate[800]}}>{promedioItemsPorCategoria}</p>
                <p className="text-sm" style={{color: AdminTheme.neutral.slate[500]}}>Platillos por categoría</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Acciones Rápidas Ultra Modernas - TEMA REFINADO */}
      <div className="relative group">
        <Card 
          className="border-2 hover:border-gray-400 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#f9fafb', borderColor: '#d1d5db' }}
        >
          <CardContent className="p-10 text-center">
            <div className="mb-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2"
                style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
              >
                <Plus className="w-8 h-8" style={{ color: '#ffffff' }} />
              </div>
              <h3 className="text-2xl font-semibold mb-3" style={{ color: '#111827' }}>¿Quieres agregar algo nuevo?</h3>
              <p className="text-lg mb-8 max-w-md mx-auto font-normal" style={{ color: '#374151' }}>
                Empieza creando una nueva categoría como <span className="font-semibold" style={{ color: '#111827' }}>"Mariscos"</span>, 
                <span className="font-semibold" style={{ color: '#111827' }}> "Carnes"</span> o 
                <span className="font-semibold" style={{ color: '#111827' }}> "Bebidas"</span>
              </p>
            </div>
            <button
              onClick={() => openAddCategory()}
              className="px-10 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2"
              style={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#334155',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0f172a';
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <Plus className="w-5 h-5" style={{ color: '#ffffff' }} />
                <span className="font-semibold" style={{ color: '#ffffff' }}>Crear Nueva Categoría</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Resumen del menú */}
      <div className="relative group">
        <Card className="backdrop-blur-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 rounded-3xl shadow-lg bg-white/95">
          <CardHeader className="rounded-t-3xl border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-gray-700 to-slate-800 flex items-center justify-center shadow-sm">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Tu Menú Actual</h3>
                <p className="text-gray-600 font-light">Vista general de tus categorías principales</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {categorias.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">¡Aún no tienes categorías!</h4>
                <p className="text-gray-600 mb-8 max-w-sm mx-auto font-light">
                  Comienza creando tu primera categoría para organizar tus platillos
                </p>
                <button 
                  onClick={() => openAddCategory()}
                  className="bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                >
                  Crear Mi Primera Categoría
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {categorias.slice(0, 6).map((categoria) => (
                  <div key={categoria.id} className="group relative">
                    <div className="relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 hover:border-gray-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-700 to-slate-800 flex items-center justify-center text-white text-xl shadow-sm">
                            {categoria.icono}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-800">{categoria.nombre}</h4>
                            <p className="text-sm text-gray-500">{categoria.total_items || categoria.items?.length || 0} platillos</p>
                          </div>
                        </div>
                        {categoria.activo ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center" title="Visible en el menú">
                            <Eye className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" title="Oculta del menú">
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditCategory(categoria)}
                          className="flex-1 px-4 py-3 rounded-xl text-sm transition-all duration-200 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          <Edit3 className="w-4 h-4 inline mr-2" />
                          Editar
                        </button>
                        <button
                          onClick={() => openAddItem(categoria.id || categoria._id)}
                          className="flex-1 px-4 py-3 rounded-xl text-sm transition-all duration-200 font-medium bg-green-100 text-green-700 hover:bg-green-200"
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
      {/* Header Moderno y Elegante */}
      <div className="relative group">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-gray-800 mb-2">Gestiona Tu Menú</h3>
                <p className="text-gray-600 text-lg font-light">
                  Edita categorías, agrega platillos y establece precios
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600 font-medium">{categorias.length} categorías</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    <span className="text-gray-600 font-medium">{totalItems} platillos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Moderno de Categorías */}
      {categorias.length === 0 ? (
        <div className="relative group">
          <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-3xl bg-white/95 backdrop-blur-xl shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-3xl font-semibold text-gray-800 mb-4">¡Comienza a crear tu menú!</h4>
              <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto font-light">
                Las categorías te ayudan a organizar tus platillos. Por ejemplo: 
                <span className="font-medium text-gray-700"> "Entradas"</span>, 
                <span className="font-medium text-gray-700"> "Platos Principales"</span>, 
                <span className="font-medium text-gray-700"> "Bebidas"</span>
              </p>
              <button 
                onClick={() => openAddCategory()}
                className="bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white px-12 py-5 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="group relative">
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 transform group-hover:scale-105 rounded-3xl overflow-hidden">
                {/* Header de la tarjeta */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                          <span className="text-2xl">{categoria.icono}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-xl text-gray-800">{categoria.nombre}</h4>
                          <p className="text-sm text-gray-500 font-medium">
                            {categoria.total_items || categoria.items?.length || 0} platillos disponibles
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {categoria.activo ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-semibold flex items-center border border-green-200">
                            <Eye className="w-3 h-3 mr-1" />
                            VISIBLE
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-semibold flex items-center border border-gray-200">
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
                  <div className="max-h-72 overflow-y-auto mb-6">
                    {categoria.items && categoria.items.length > 0 ? (
                      <div className="space-y-3">
                        {categoria.items.map((item, index) => (
                          <div 
                            key={`${categoria.id}-${index}`} 
                            className="group bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0 mr-4">
                                <h5 className="font-semibold text-gray-800 truncate text-lg">{item.nombre}</h5>
                                {item.descripcion && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.descripcion}</p>
                                )}
                                <div className="mt-2 flex items-center space-x-2">
                                  <span className="text-2xl font-bold text-green-600">${item.precio}</span>
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
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <ChefHat className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-2">
                          {categoria.total_items && categoria.total_items > 0 
                            ? `${categoria.total_items} platillos disponibles` 
                            : 'Sin platillos aún'
                          }
                        </p>
                        <p className="text-gray-400 text-xs">Agrega platillos para completar esta categoría</p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción modernos */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openEditCategory(categoria)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all duration-300 font-semibold border border-gray-200 flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar Categoría</span>
                    </button>
                    <button
                      onClick={() => openAddItem(categoria.id || categoria._id)}
                      className="flex-1 bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm hover:bg-green-200 transition-all duration-300 font-semibold border border-green-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Platillo</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando panel...</h2>
          <p className="text-gray-600">Un momento por favor</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error de carga</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              cargarDatosIniciales();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
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

      {/* Header Ultra Moderno - TEMA RESTAURANTE VERDE/NARANJA */}
      <header className="relative z-10 shadow-2xl border-b-4" style={{
        background: `linear-gradient(to right, ${AdminTheme.primary.green[800]}, ${AdminTheme.primary.green[900]}, ${AdminTheme.primary.green[800]})`,
        borderColor: AdminTheme.primary.orange[500]
      }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-24">
            {/* Logo y Título */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-200" style={{
                  background: `linear-gradient(to right, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`
                }}>
                  <ChefHat className="w-9 h-9 text-white" style={{color: AdminTheme.neutral.white}} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Panel de Administración
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Store className="w-4 h-4" style={{color: AdminTheme.primary.green[200]}} />
                    <span className="text-sm font-medium" style={{color: AdminTheme.primary.green[100]}}>Restaurante Darío</span>
                  </div>
                  <div className="w-1 h-4 rounded-full" style={{backgroundColor: AdminTheme.primary.orange[500]}}></div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium" style={{color: AdminTheme.status.success[300]}}>En línea</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Panel de Usuario y Controles */}
            <div className="flex items-center space-x-6">
              {/* Información del Usuario - TEMA RESTAURANTE REFINADO */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="rounded-2xl p-4 border shadow-lg backdrop-blur-sm" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                        background: `linear-gradient(to right, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`,
                        opacity: 0.9
                      }}>
                        <User className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{
                        backgroundColor: AdminTheme.status.success[500],
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}>
                        <Shield className="w-2 h-2 text-white" style={{color: AdminTheme.neutral.white}} />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-sm text-white opacity-90">{usuario?.nombre || 'Administrador'}</p>
                        <div className="px-3 py-1 rounded-lg shadow-md" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(4px)'
                        }}>
                          <span className="text-white text-xs font-bold opacity-90">ADMIN</span>
                        </div>
                      </div>
                      <p className="text-xs text-white opacity-70">{usuario?.email || 'admin@restaurante.com'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Timer de Sesión - Refinado */}
                <div className="rounded-2xl p-4 border shadow-lg backdrop-blur-sm" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                  borderColor: 'rgba(255, 255, 255, 0.25)'
                }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${AdminTheme.primary.green[400]}, ${AdminTheme.primary.orange[400]})`
                    }}>
                      <Timer className="w-5 h-5 text-white" style={{color: AdminTheme.neutral.white}} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-medium text-white/70">Tiempo de sesión</p>
                      <p ref={timeDisplayRef} className="text-white font-bold text-lg">{timeRemaining || '...'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de Acción - Solo Cerrar Sesión */}
              <div className="flex items-center">
                {/* Botón de Cerrar Sesión - TEMA RESTAURANTE */}
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                      onLogout();
                    }
                  }}
                  className="flex items-center space-x-3 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border"
                  style={{
                    background: `linear-gradient(to right, ${AdminTheme.primary.red[600]}, ${AdminTheme.primary.red[700]})`,
                    borderColor: AdminTheme.primary.red[500],
                    color: AdminTheme.neutral.white
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(to right, ${AdminTheme.primary.red[700]}, ${AdminTheme.primary.red[800]})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(to right, ${AdminTheme.primary.red[600]}, ${AdminTheme.primary.red[700]})`;
                  }}
                  title="Cerrar sesión y regresar a la página principal"
                >
                  <LogOut className="w-5 h-5" style={{color: AdminTheme.neutral.white}} />
                  <span className="hidden lg:inline font-semibold" style={{color: AdminTheme.neutral.white}}>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Navegación Refinada y Elegante */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-3xl blur opacity-10 group-hover:opacity-15 transition-opacity duration-300" style={{
              background: `linear-gradient(to right, ${AdminTheme.primary.green[300]}, ${AdminTheme.primary.orange[300]})`
            }}></div>
            <div className="relative backdrop-blur-xl rounded-3xl shadow-xl p-4 border transition-all duration-300" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderColor: AdminTheme.primary.green[200] 
            }}>
              <nav className="flex space-x-3">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex-1 flex items-center justify-center space-x-2 lg:space-x-4 py-4 lg:py-6 px-4 lg:px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-102 ${
                      activeTab === tab.id
                        ? 'text-white shadow-lg border scale-102'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:shadow-md'
                    }`}
                    style={activeTab === tab.id ? { 
                      background: `linear-gradient(135deg, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`,
                      color: AdminTheme.neutral.white,
                      borderColor: AdminTheme.primary.green[400],
                      boxShadow: `0 10px 25px -5px rgba(34, 197, 94, 0.25)`
                    } : { 
                      color: AdminTheme.neutral.slate[700], 
                      backgroundColor: 'transparent' 
                    }}
                  >
                    {/* Efecto de fondo suave para tab activo */}
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 rounded-2xl opacity-20" style={{
                        background: `linear-gradient(135deg, ${AdminTheme.primary.green[400]}, ${AdminTheme.primary.orange[400]})`
                      }}></div>
                    )}
                    
                    {/* Contenido del botón */}
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'bg-white/20 shadow-sm' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                      style={activeTab === tab.id ? { 
                        backgroundColor: 'rgba(255,255,255,0.25)'
                      } : { 
                        backgroundColor: AdminTheme.neutral.slate[100]
                      }}>
                        <div className="transition-all duration-300" 
                             style={{ color: activeTab === tab.id ? AdminTheme.neutral.white : AdminTheme.neutral.slate[600] }}>
                          {React.cloneElement(tab.icon, { 
                            className: `w-5 h-5 transition-all duration-300`,
                            style: { color: activeTab === tab.id ? AdminTheme.neutral.white : AdminTheme.neutral.slate[600] }
                          })}
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <span className="text-lg font-semibold block" style={{ color: activeTab === tab.id ? AdminTheme.neutral.white : AdminTheme.neutral.slate[700] }}>
                          {tab.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Línea de progreso inferior */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-b-2xl" style={{ backgroundColor: '#f59e0b' }}></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Descripción Elegante y Refinada */}
          <div className="mt-6">
            <div className="relative group">
              <div className="absolute inset-0 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
                background: `linear-gradient(to right, ${AdminTheme.primary.green[200]}, ${AdminTheme.primary.orange[200]})`
              }}></div>
              <div className="relative backdrop-blur-xl rounded-2xl p-6 border shadow-lg transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderColor: AdminTheme.neutral.slate[200] 
              }}>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{
                    background: `linear-gradient(135deg, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`
                  }}>
                    {activeTab === 'dashboard' && <BarChart3 className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />}
                    {activeTab === 'menu' && <ChefHat className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />}
                    {activeTab === 'imagenes' && <Image className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />}
                    {activeTab === 'info' && <Store className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1" style={{color: AdminTheme.neutral.slate[800]}}>
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed" style={{color: AdminTheme.neutral.slate[600]}}>
                      {tabs.find(tab => tab.id === activeTab)?.description}
                    </p>
                  </div>
                </div>
                
                {/* Barra de progreso decorativa */}
                <div className="mt-6">
                  <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden" style={{backgroundColor: AdminTheme.primary.orange[200]}}>
                    <div className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-full animate-pulse shadow-lg" style={{backgroundColor: AdminTheme.primary.orange[500]}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Ultra Moderno */}
        <div className="transition-all duration-500">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'menu' && renderMenuManagement()}
          {activeTab === 'imagenes' && (
            <div className="relative overflow-hidden">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 opacity-5" style={{
                background: `linear-gradient(135deg, ${AdminTheme.primary.green[300]}, ${AdminTheme.primary.orange[300]})`
              }}></div>
              
              <div className="relative backdrop-blur-xl rounded-2xl shadow-xl border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderColor: AdminTheme.primary.green[200],
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(${AdminTheme.primary.green[50].slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.3))`
              }}>
                {/* Header colorido */}
                <div className="p-6 border-b" style={{
                  background: `linear-gradient(135deg, ${AdminTheme.primary.green[50]}, ${AdminTheme.primary.orange[50]})`,
                  borderColor: AdminTheme.primary.green[100]
                }}>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{
                      background: `linear-gradient(135deg, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`
                    }}>
                      <Image className="w-6 h-6 text-white" style={{color: AdminTheme.neutral.white}} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: AdminTheme.primary.green[800] }}>Gestión de Imágenes</h2>
                      <p className="text-sm" style={{ color: AdminTheme.primary.orange[600] }}>Administra las imágenes del restaurante de forma fácil y eficiente</p>
                    </div>
                  </div>
                  <div className="w-24 h-1 rounded-full" style={{
                    background: `linear-gradient(to right, ${AdminTheme.primary.green[500]}, ${AdminTheme.primary.orange[500]})`
                  }}></div>
                </div>
                
                {/* Contenido con padding */}
                <div className="p-6">
                  <SimpleImageManager />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'info' && (
            <div className="backdrop-blur-xl rounded-2xl shadow-xl border overflow-hidden" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderColor: AdminTheme.neutral.slate[200] 
            }}>
              <div className="bg-gradient-to-r p-8 text-white" style={{background: `linear-gradient(to right, ${AdminTheme.primary.green[700]}, ${AdminTheme.primary.green[800]}, ${AdminTheme.primary.green[700]})`}}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 backdrop-blur-sm rounded-2xl flex items-center justify-center border shadow-lg" style={{backgroundColor: AdminTheme.primary.green[600], borderColor: AdminTheme.primary.green[500]}}>
                    <Settings className="w-8 h-8 text-white" style={{color: AdminTheme.neutral.white}} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: AdminTheme.neutral.white }}>Información del Restaurante</h2>
                    <p className="text-lg font-medium" style={{ color: AdminTheme.primary.green[100] }}>Personaliza los datos principales de tu restaurante</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="backdrop-blur-sm rounded-xl p-4 border shadow-lg" style={{backgroundColor: AdminTheme.primary.green[600], borderColor: AdminTheme.primary.green[500]}}>
                    <div className="flex items-center space-x-2">
                      <Store className="w-5 h-5" style={{ color: AdminTheme.primary.green[100] }} />
                      <span className="font-semibold" style={{ color: AdminTheme.primary.green[100] }}>Configuración</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-1" style={{ color: AdminTheme.neutral.white }}>Completa</p>
                  </div>
                  <div className="backdrop-blur-sm rounded-xl p-4 border shadow-lg" style={{backgroundColor: AdminTheme.primary.orange[600], borderColor: AdminTheme.primary.orange[500]}}>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" style={{ color: AdminTheme.primary.orange[100] }} />
                      <span className="text-orange-100 font-semibold" style={{ color: AdminTheme.primary.orange[100] }}>Vista Previa</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-1" style={{ color: AdminTheme.neutral.white }}>En Vivo</p>
                  </div>
                  <div className="backdrop-blur-sm rounded-xl p-4 border shadow-lg" style={{backgroundColor: AdminTheme.primary.green[600], borderColor: AdminTheme.primary.green[500]}}>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5" style={{ color: AdminTheme.primary.green[100] }} />
                      <span className="font-semibold" style={{ color: AdminTheme.primary.green[100] }}>Estado</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-1" style={{ color: AdminTheme.neutral.white }}>Activo</p>
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
      {showCategoryModal && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onCategoryChange={() => {
            handleCategoryChange();
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}

      {showItemModal && (
        <EditItemModal
          item={editingItem?.item || null}
          categoryId={editingItem?.categoryId || selectedCategoryForItems || ''}
          categorias={categorias}
          isOpen={showItemModal}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
            setSelectedCategoryForItems(null);
          }}
          onItemChange={() => {
            handleItemChange();
            setShowItemModal(false);
            setEditingItem(null);
            setSelectedCategoryForItems(null);
          }}
        />
      )}
    </div>
  );
}