import { useState, useEffect } from 'react';

export interface RestauranteInfo {
  // Información básica
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  
  // Contacto
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  
  // Redes sociales
  facebook: string;
  instagram: string;
  website: string;
  
  // Imágenes
  logo_url: string;
  imagen_banner_url: string;
  imagen_sobre_nosotros_url: string;
  
  // Estadísticas
  anos_experiencia: number;
  clientes_satisfechos: number;
  platos_unicos: number;
}

export interface UseRestauranteInfoReturn {
  restauranteInfo: RestauranteInfo | null;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export function useRestauranteInfo(): UseRestauranteInfoReturn {
  const [restauranteInfo, setRestauranteInfo] = useState<RestauranteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    cargarInfoRestaurante();
  }, []);

  const cargarInfoRestaurante = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/restaurante/info-publica`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validar que tenemos los datos mínimos necesarios
      if (!data.nombre) {
        throw new Error('Los datos del restaurante están incompletos');
      }

      setRestauranteInfo(data);
      setConnected(true);
      console.log('✅ Información del restaurante cargada correctamente:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setConnected(false);
      setRestauranteInfo(null);
      console.error('❌ Error cargando información del restaurante:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    restauranteInfo,
    loading,
    error,
    connected
  };
}

// Función helper para construir URLs de imágenes
export function getImageUrl(url: string, baseUrl?: string): string {
  if (!url) return '';
  
  const API_URL = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Si la URL ya es completa (http/https), la usamos tal como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si la URL empieza con /api/ (GridFS), agregamos el base URL
  if (url.startsWith('/api/')) {
    return `${API_URL}${url}`;
  }
  
  // Si es una ruta relativa que empieza con /, asumimos que está en public
  if (url.startsWith('/')) {
    return url;
  }
  
  // Si es solo el nombre del archivo, asumimos que está en public
  return `/${url}`;
}