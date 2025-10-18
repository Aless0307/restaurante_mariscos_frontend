import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, RefreshCw } from 'lucide-react';

interface Categoria {
  _id: string;
  nombre: string;
  icono: string;
  imagen_url?: string;
  imagen_url_original?: string;
  total_items: number;
}

const SimpleImageManager: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        console.log('🔴 Token expirado en SimpleImageManager');
        // Limpiar token y recargar página para mostrar modal de expiración
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarImagenCategoria = async (categoriaId: string, file: File) => {
    try {
      setUploadingCategory(categoriaId);
      const token = localStorage.getItem('adminToken');
      
      // 1. Subir la imagen primero
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (uploadResponse.status === 401) {
        console.log('🔴 Token expirado en upload imagen');
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }

      const uploadData = await uploadResponse.json();
      console.log('✅ Imagen subida:', uploadData);

      // 2. Actualizar la categoría con la nueva imagen
      const updateResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoriaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagen_url_original: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${uploadData.image_url}` // Usar la URL del entorno
        })
      });

      if (updateResponse.status === 401) {
        console.log('🔴 Token expirado en actualizar categoría');
        localStorage.removeItem('adminToken');
        window.location.reload();
        return;
      }

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      console.log('✅ Categoría actualizada exitosamente');
      
      // 3. Recargar categorías para mostrar los cambios
      await cargarCategorias();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar la imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setUploadingCategory(null);
    }
  };

  // Función comentada - no necesaria por ahora
  /*
  const quitarImagenCategoria = async (categoriaId: string) => {
    if (!confirm('¿Estás seguro de que quieres quitar la imagen de esta categoría? La categoría seguirá existiendo.')) {
      return;
    }

    try {
      setUploadingCategory(categoriaId);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoriaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagen_url_original: null
        })
      });

      if (!response.ok) {
        throw new Error('Error al quitar la imagen');
      }

      console.log('✅ Imagen quitada (categoría preservada)');
      await cargarCategorias();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al quitar la imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setUploadingCategory(null);
    }
  };
  */

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">📸 Estado de las Categorías del Menú</h2>
          <p className="text-gray-600">Verifica que todas tus categorías estén intactas</p>
        </div>
        <Button onClick={cargarCategorias} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </Button>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          💡 <strong>Cómo usar:</strong> Haz clic en "Cambiar imagen" o "Agregar imagen" para seleccionar una foto de tu computadora. 
          La imagen se subirá automáticamente y se asignará a la categoría.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((categoria) => (
          <Card key={categoria._id} className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-700">
                <span className="mr-2 text-2xl">{categoria.icono}</span>
                {categoria.nombre}
              </CardTitle>
              <p className="text-sm text-gray-600">{categoria.total_items} items</p>
            </CardHeader>
            
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-3">
                {categoria.imagen_url ? (
                  <img
                    src={categoria.imagen_url}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-red-500 text-center"><p>⚠️ Error de URL</p></div>';
                      }
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="text-4xl block mb-2">{categoria.icono}</span>
                    <p className="text-sm">Sin imagen asignada</p>
                    <p className="text-xs text-gray-400 mt-1">Haz clic en "Cambiar imagen" para agregar una</p>
                  </div>
                )}
              </div>
              
              {/* Botón para cambiar imagen */}
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`file-input-${categoria._id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('📁 Archivo seleccionado:', file.name);
                      cambiarImagenCategoria(categoria._id, file);
                    }
                  }}
                  disabled={uploadingCategory === categoria._id}
                />
                <Button
                  variant={categoria.imagen_url ? "outline" : "default"}
                  className="w-full"
                  disabled={uploadingCategory === categoria._id}
                  onClick={() => {
                    const fileInput = document.getElementById(`file-input-${categoria._id}`) as HTMLInputElement;
                    fileInput?.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingCategory === categoria._id 
                    ? 'Subiendo...' 
                    : categoria.imagen_url 
                      ? 'Cambiar imagen' 
                      : 'Agregar imagen'
                  }
                </Button>
              </div>
              
              <div className="space-y-2 text-xs text-gray-500">
                <p><strong>ID:</strong> {categoria._id}</p>
                {categoria.imagen_url && (
                  <p className="break-all"><strong>URL:</strong> {categoria.imagen_url.substring(0, 50)}...</p>
                )}
                <p><strong>Estado:</strong> {uploadingCategory === categoria._id ? '🔄 Procesando...' : '✅ Listo'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categorias.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron categorías</p>
        </div>
      )}
    </div>
  );
};

export default SimpleImageManager;