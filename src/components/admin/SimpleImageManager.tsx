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
          <h2 className="text-2xl font-bold text-gray-800">Estado de las Categorías del Menú</h2>
          <p className="text-base text-gray-600 mt-1">Verifica que todas tus categorías estén intactas</p>
        </div>
        <Button 
          onClick={cargarCategorias} 
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </Button>
      </div>

      <Alert className="border-l-4 border-l-green-600 bg-gradient-to-r from-green-50 to-white shadow-sm">
        <AlertDescription className="text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800 text-base mb-1">Cómo usar</p>
              <p className="text-sm leading-relaxed">
                Haz clic en <span className="font-medium text-green-700">"Cambiar imagen"</span> o <span className="font-medium text-green-700">"Agregar imagen"</span> para seleccionar una foto de tu computadora. 
                La imagen se subirá automáticamente y se asignará a la categoría.
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <Card key={categoria._id} className="border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
            <CardHeader className="pb-2 bg-white border-b border-gray-100">
              <CardTitle className="flex items-center justify-between text-gray-800 text-base font-semibold">
                <div className="flex items-center">
                  <span className="mr-2 text-2xl">{categoria.icono}</span>
                  <span>{categoria.nombre}</span>
                </div>
                <span className="text-sm text-gray-500 font-normal">{categoria.total_items} items</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                {categoria.imagen_url ? (
                  <img
                    src={categoria.imagen_url}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-red-500 text-center p-4"><p class="font-semibold text-sm">Error al cargar imagen</p></div>';
                      }
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    <span className="text-4xl block mb-2">{categoria.icono}</span>
                    <p className="text-sm font-medium text-gray-500">Sin imagen</p>
                  </div>
                )}
              </div>
              
              {/* Botón para cambiar imagen */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`file-input-${categoria._id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('Archivo seleccionado:', file.name);
                      cambiarImagenCategoria(categoria._id, file);
                    }
                  }}
                  disabled={uploadingCategory === categoria._id}
                />
                <Button
                  variant={categoria.imagen_url ? "outline" : "default"}
                  className={`w-full font-semibold ${categoria.imagen_url ? 'border-green-600 text-green-700 hover:bg-green-50' : 'bg-green-600 hover:bg-green-700 text-white'}`}
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