import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Upload, ImageIcon, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface SeccionImagen {
  _id?: string;
  seccion: string;
  titulo: string;
  descripcion: string;
  imagen_id?: string;
  imagen_url?: string;
  orden: number;
  activo: boolean;
  fecha_actualizacion?: string;
}

const SectionImageManager: React.FC = () => {
  const [secciones, setSecciones] = useState<SeccionImagen[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar secciones al montar el componente
  useEffect(() => {
    cargarSecciones();
  }, []);

  const cargarSecciones = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/secciones-imagenes/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSecciones(data);
      } else {
        throw new Error('Error al cargar secciones');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las secciones de imágenes');
    } finally {
      setLoading(false);
    }
  };

  const subirImagen = async (seccion: string, file: File) => {
    try {
      setUploadingSection(seccion);
      const token = localStorage.getItem('adminToken');
      
      // Subir imagen
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }

      const uploadData = await uploadResponse.json();
      
      // Actualizar sección con nueva imagen
      const updateResponse = await fetch(`/api/secciones-imagenes/${seccion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagen_id: uploadData.image_id,
          imagen_url: uploadData.image_url
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar la sección');
      }

      // Recargar secciones
      await cargarSecciones();
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir la imagen');
    } finally {
      setUploadingSection(null);
    }
  };

  const eliminarImagen = async (seccion: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la imagen de "${seccion}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/secciones-imagenes/${seccion}/imagen`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen');
      }

      // Recargar secciones
      await cargarSecciones();
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la imagen');
    }
  };

  const handleFileSelect = (seccion: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      subirImagen(seccion, file);
    }
  };

  const copiarUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin h-8 w-8" />
        <span className="ml-2">Cargando secciones...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Imágenes por Sección</h2>
        <Button onClick={cargarSecciones} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {error && (
        <Alert className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secciones.map((seccion) => (
          <Card key={seccion.seccion} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{seccion.titulo}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {seccion.descripcion}
                  </p>
                </div>
                <Badge variant={seccion.activo ? "default" : "secondary"}>
                  {seccion.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Área de imagen */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {seccion.imagen_url ? (
                  <img
                    src={seccion.imagen_url}
                    alt={seccion.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Sin imagen asignada</p>
                  </div>
                )}
              </div>

              {/* Controles */}
              <div className="flex gap-2">
                {/* Botón subir imagen */}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(seccion.seccion, e)}
                    className="hidden"
                    id={`upload-${seccion.seccion}`}
                    disabled={uploadingSection === seccion.seccion}
                  />
                  <label
                    htmlFor={`upload-${seccion.seccion}`}
                    className={`w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors ${
                      uploadingSection === seccion.seccion ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingSection === seccion.seccion ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {seccion.imagen_url ? 'Cambiar' : 'Subir'}
                  </label>
                </div>

                {/* Botón copiar URL (solo si hay imagen) */}
                {seccion.imagen_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copiarUrl(seccion.imagen_url!)}
                    title="Copiar URL"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}

                {/* Botón eliminar (solo si hay imagen) */}
                {seccion.imagen_url && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => eliminarImagen(seccion.seccion)}
                    title="Eliminar imagen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Información adicional */}
              {seccion.fecha_actualizacion && (
                <p className="text-xs text-gray-500 mt-2">
                  Actualizado: {new Date(seccion.fecha_actualizacion).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {secciones.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay secciones configuradas
          </h3>
          <p className="text-gray-600">
            Las secciones se crearán automáticamente al cargar la página.
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionImageManager;