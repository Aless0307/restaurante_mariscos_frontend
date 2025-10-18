// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipos para TypeScript
export interface RestauranteInfo {
  nombre: string;
  descripcion_corta: string;
  descripcion_larga?: string;
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  fecha_actualizacion?: string;
}

export interface ItemMenu {
  id: string;
  categoria_id: string;
  categoria_nombre: string;
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: boolean;
  orden: number;
}

export interface CategoriaMenu {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  orden: number;
  activo: boolean;
  imagen_url_original?: string;
  imagen_id?: string;
  items: ItemMenu[];
}

export interface MenuCompleto {
  categorias: CategoriaMenu[];
  total_categorias: number;
  total_items: number;
}

export interface ContactoInfo {
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: {
    calle: string;
    codigo_postal: string;
    ciudad: string;
    estado: string;
    pais: string;
  };
  horarios: {
    todos_los_dias: string;
  };
  maps_embed: string;
}

export interface CaracteristicaRestaurante {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface ServicioRestaurante {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

// Funciones para llamadas a la API
class RestauranteAPI {
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener información general del restaurante
  async getRestauranteInfo(): Promise<RestauranteInfo> {
    return this.fetchAPI<RestauranteInfo>('/api/restaurante/info');
  }

  // Obtener información de contacto
  async getContactoInfo(): Promise<ContactoInfo> {
    return this.fetchAPI<ContactoInfo>('/api/restaurante/contacto');
  }

  // Obtener menú completo
  async getMenuCompleto(): Promise<MenuCompleto> {
    return this.fetchAPI<MenuCompleto>('/api/mongo/menu/menu-completo');
  }

  // Obtener menú público (para el frontend público)
  async getMenuPublico(): Promise<MenuCompleto> {
    // Ahora usando el endpoint principal arreglado
    return this.fetchAPI<MenuCompleto>('/api/restaurante/menu-publico');
  }

  // Obtener categorías del menú
  async getCategorias(incluirItems: boolean = false): Promise<CategoriaMenu[]> {
    const params = incluirItems ? '?incluir_items=true' : '';
    return this.fetchAPI<CategoriaMenu[]>(`/api/mongo/menu/categorias${params}`);
  }

  // Obtener items del menú con filtros
  async getItems(filtros?: {
    categoria_id?: string;
    disponibles_solo?: boolean;
    buscar?: string;
  }): Promise<ItemMenu[]> {
    const params = new URLSearchParams();
    if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id);
    if (filtros?.disponibles_solo !== undefined) params.append('disponibles_solo', filtros.disponibles_solo.toString());
    if (filtros?.buscar) params.append('buscar', filtros.buscar);
    
    const queryString = params.toString();
    return this.fetchAPI<ItemMenu[]>(`/api/mongo/menu/items${queryString ? '?' + queryString : ''}`);
  }

  // Obtener características del restaurante
  async getCaracteristicas(): Promise<CaracteristicaRestaurante[]> {
    return this.fetchAPI<CaracteristicaRestaurante[]>('/api/restaurante/caracteristicas');
  }

  // Obtener servicios del restaurante
  async getServicios(): Promise<ServicioRestaurante[]> {
    return this.fetchAPI<ServicioRestaurante[]>('/api/restaurante/servicios');
  }

  // Obtener imagen desde GridFS
  getImagenUrl(imagenId: string): string {
    return `${API_BASE_URL}/api/mongo/menu/imagen/${imagenId}`;
  }
}

// Instancia singleton de la API
export const restauranteAPI = new RestauranteAPI();

// Hook personalizado para manejar estados de carga
export const useAPI = () => {
  return {
    api: restauranteAPI,
    isLoading: false, // Se puede extender con estados de carga más adelante
    error: null
  };
};