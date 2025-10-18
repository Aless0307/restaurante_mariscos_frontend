import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, ImageIcon, Trash2, Eye, RefreshCw, Grid, Layers } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

// Secciones predefinidas del restaurante
const SECCIONES_PREDEFINIDAS = [
  { id: 'hero', nombre: 'Imagen Principal (Hero)', descripcion: 'Imagen grande de la página principal', tipo: 'seccion' },
  { id: 'about', nombre: 'Sección Nosotros', descripcion: 'Imagen de la sección acerca de nosotros', tipo: 'seccion' },
  { id: 'chef', nombre: 'Chef Principal', descripcion: 'Foto del chef o equipo de cocina', tipo: 'seccion' },
  { id: 'restaurant', nombre: 'Interior del Restaurante', descripcion: 'Fotos del ambiente interior', tipo: 'seccion' },
  { id: 'terrace', nombre: 'Terraza/Exterior', descripcion: 'Fotos del área exterior o terraza', tipo: 'seccion' },
  { id: 'specialties', nombre: 'Especialidades', descripcion: 'Imágenes de platos especiales', tipo: 'seccion' },
  { id: 'events', nombre: 'Eventos', descripcion: 'Fotos de eventos y celebraciones', tipo: 'seccion' },
  { id: 'contact', nombre: 'Contacto', descripcion: 'Imagen de la sección de contacto', tipo: 'seccion' }
];

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

interface Imagen {
  _id: string;
  filename: string;
  content_type: string;
  upload_date: string;
  length: number;
  url: string;
}

const UnifiedImageManager: React.FC = () => {
  const [secciones, setSecciones] = useState<SeccionImagen[]>([]);
  const [categoriasMenu, setCategoriasMenu] = useState<any[]>([]);
  const [todasLasImagenes, setTodasLasImagenes] = useState<Imagen[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('categorias');

  // Inicializar secciones predefinidas
  useEffect(() => {
    // Crear secciones vacías si no existen
    const seccionesIniciales: SeccionImagen[] = SECCIONES_PREDEFINIDAS.map(seccion => ({
      _id: seccion.id,
      seccion: seccion.id,
      titulo: seccion.nombre,
      descripcion: seccion.descripcion,
      imagen_id: undefined,
      imagen_url: undefined,
      orden: 0,
      activo: true
    }));
    setSecciones(seccionesIniciales);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    // Cargar automáticamente todas las imágenes y categorías del menú
    await Promise.all([
      cargarTodasLasImagenes(),
      cargarCategoriasMenu()
    ]);
    setLoading(false);
  };

  const cargarCategoriasMenu = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔍 DEBUG: Cargando categorías del menú...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ DEBUG: Categorías del menú cargadas:', data.length);
        setCategoriasMenu(data);
      } else {
        throw new Error('Error al cargar categorías del menú');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las categorías del menú');
    }
  };

  const cargarSecciones = async () => {
    // Función comentada temporalmente por problemas con el endpoint
    /*
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/secciones-imagenes/`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
    }
    */
  };

  const cargarTodasLasImagenes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔍 DEBUG: Token desde localStorage:', token ? 'Token existe' : 'Token es null');
      
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/imagenes`;
      console.log('🔍 DEBUG: URL de petición:', url);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('🔍 DEBUG: Status de respuesta:', response.status);
      console.log('🔍 DEBUG: Headers de respuesta:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ DEBUG: Imágenes cargadas:', data.length);
        setTodasLasImagenes(data);
      } else {
        const errorText = await response.text();
        console.log('❌ DEBUG: Error response text:', errorText);
        throw new Error('Error al cargar imágenes');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las imágenes');
    }
  };

  const subirImagenASeccion = async (seccion: string, file: File) => {
    try {
      setUploadingSection(seccion);
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Error al subir la imagen');

      const uploadData = await uploadResponse.json();
      
      const updateResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/secciones-imagenes/${seccion}`, {
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

      if (!updateResponse.ok) throw new Error('Error al actualizar la sección');

      await cargarDatos();
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir la imagen');
    } finally {
      setUploadingSection(null);
    }
  };

  const subirImagenGeneral = async (file: File) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      await cargarTodasLasImagenes();
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const eliminarImagenDeSeccion = async (seccion: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la imagen de "${seccion}"?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/secciones-imagenes/${seccion}/imagen`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al eliminar la imagen');

      await cargarSecciones();
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la imagen');
    }
  };

  const eliminarImagenGeneral = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/imagenes/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al eliminar la imagen');

      await cargarTodasLasImagenes();
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la imagen');
    }
  };

  const cambiarImagenCategoria = async (categoriaId: string, nuevaImagenUrl: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoriaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagen_url_original: nuevaImagenUrl
        })
      });

      if (!response.ok) throw new Error('Error al cambiar la imagen de la categoría');

      await cargarCategoriasMenu(); // Recargar categorías
      console.log('✅ Imagen de categoría cambiada exitosamente');
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cambiar la imagen de la categoría');
    }
  };

  const quitarImagenCategoria = async (categoriaId: string) => {
    try {
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

      if (!response.ok) throw new Error('Error al quitar la imagen de la categoría');

      await cargarCategoriasMenu(); // Recargar categorías
      console.log('✅ Imagen de categoría quitada (pero la categoría sigue existiendo)');
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al quitar la imagen de la categoría');
    }
  };

  const eliminarCategoria = async (categoriaId: string, categoriaNombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoriaNombre}"?\n\nEsta acción eliminará la categoría y todos sus items. No se puede deshacer.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoriaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar categoría: ${response.status} - ${errorText}`);
      }

      await cargarCategoriasMenu(); // Recargar categorías
      console.log('✅ Categoría eliminada exitosamente:', categoriaNombre);
      
    } catch (error) {
      console.error('Error:', error);
      setError(`Error al eliminar la categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const asignarImagenASeccion = async (seccion: string, imageUrl: string, imageId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/secciones-imagenes/${seccion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagen_id: imageId,
          imagen_url: imageUrl
        })
      });

      if (!response.ok) throw new Error('Error al asignar la imagen');

      await cargarSecciones();
      setActiveTab('secciones'); // Cambiar a la pestaña de secciones para mostrar el resultado
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al asignar la imagen');
    }
  };

  const copiarUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const renderCategoriasTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <span className="text-2xl mr-2">🍽️</span>
            Gestión de Categorías del Menú
          </h3>
          <p className="text-sm text-gray-600">
            Administra las categorías de tu menú: crear, editar, cambiar imágenes y eliminar.
          </p>
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚠️ <strong>Cuidado:</strong> Al eliminar una categoría se eliminarán también todos sus items.
            </p>
          </div>
        </div>
        <Button onClick={cargarCategoriasMenu} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {categoriasMenu.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando categorías del menú...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriasMenu.map((categoria) => (
            <Card key={categoria._id} className="overflow-hidden border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-green-700 flex items-center">
                      <span className="mr-2">{categoria.icono}</span>
                      {categoria.nombre}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {categoria.total_items} items en el menú
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-green-600">
                      Activa
                    </Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => eliminarCategoria(categoria._id, categoria.nombre)}
                      title={`Eliminar categoría "${categoria.nombre}"`}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Área de imagen de la categoría */}
                <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden border-2 border-dashed border-green-300 relative">
                  {categoria.imagen_url ? (
                    <>
                      <img
                        src={categoria.imagen_url}
                        alt={categoria.nombre}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center text-red-500">
                                <div class="text-2xl mb-2">⚠️</div>
                                <p class="text-sm">Error al cargar imagen</p>
                                <p class="text-xs text-gray-500 mt-1">URL: ${categoria.imagen_url}</p>
                              </div>
                            `;
                          }
                        }}
                      />
                      {/* Overlay con acciones cuando hay imagen */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => quitarImagenCategoria(categoria._id)}
                            title="Quitar imagen (la categoría sigue existiendo)"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(categoria.imagen_url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 p-6">
                      <span className="text-4xl mb-3 block">{categoria.icono}</span>
                      <p className="text-sm font-medium">Sin imagen asignada</p>
                      <p className="text-xs text-gray-400 mt-1">La categoría existe, solo falta imagen</p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setUploadingSection(categoria._id);
                              const token = localStorage.getItem('adminToken');
                              
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/upload-image`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: formData
                              });

                              if (!uploadResponse.ok) throw new Error('Error al subir la imagen');

                              const uploadData = await uploadResponse.json();
                              const nuevaImagenUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${uploadData.image_url}`;
                              
                              await cambiarImagenCategoria(categoria._id, nuevaImagenUrl);
                            } catch (error) {
                              console.error('Error:', error);
                              setError('Error al subir la imagen de la categoría');
                            } finally {
                              setUploadingSection(null);
                            }
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={uploadingSection === categoria._id}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingSection === categoria._id ? 'Subiendo...' : 'Cambiar imagen'}
                      </Button>
                    </label>
                  </div>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => eliminarCategoria(categoria._id, categoria.nombre)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Categoría
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  ID: {categoria._id}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderSeccionesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Layers className="h-5 w-5 mr-2 text-blue-600" />
            Espacios reservados para imágenes
          </h3>
          <p className="text-sm text-gray-600">
            Cada sección tiene un espacio reservado. Selecciona una imagen de la galería para asignarla.
          </p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Tip:</strong> Ve a la pestaña "Todas las imágenes" para seleccionar y asignar imágenes a cada sección.
            </p>
          </div>
        </div>
        <Button onClick={() => setActiveTab('imagenes')} variant="outline">
          <Grid className="h-4 w-4 mr-2" />
          Ver todas las imágenes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secciones.map((seccion) => (
          <Card key={seccion.seccion} className="overflow-hidden border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-blue-700">{seccion.titulo}</CardTitle>
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
              {/* Área reservada para la imagen */}
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative">
                {seccion.imagen_url ? (
                  <>
                    <img
                      src={seccion.imagen_url}
                      alt={seccion.titulo}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="text-center text-red-500">
                              <div class="text-2xl mb-2">⚠️</div>
                              <p class="text-sm">Error al cargar imagen</p>
                              <p class="text-xs text-gray-500 mt-1">URL: ${seccion.imagen_url}</p>
                            </div>
                          `;
                        }
                      }}
                    />
                    {/* Overlay con acciones cuando hay imagen */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => eliminarImagenDeSeccion(seccion.seccion)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(seccion.imagen_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 p-6">
                    <ImageIcon className="h-16 w-16 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium">Espacio reservado</p>
                    <p className="text-xs text-gray-400 mt-1">Arrastra una imagen aquí o selecciona una</p>
                  </div>
                )}
                <div className="hidden text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Error al cargar imagen</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) subirImagenASeccion(seccion.seccion, file);
                    }}
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

                {seccion.imagen_url && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copiarUrl(seccion.imagen_url!)}
                      title="Copiar URL"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => eliminarImagenDeSeccion(seccion.seccion)}
                      title="Eliminar imagen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {seccion.fecha_actualizacion && (
                <p className="text-xs text-gray-500 mt-2">
                  Actualizado: {new Date(seccion.fecha_actualizacion).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTodasLasImagenesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Todas las Imágenes</h3>
          <p className="text-sm text-gray-600">
            Gestiona todas las imágenes y asígnalas a secciones específicas
          </p>
        </div>
        <div className="flex gap-2">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) subirImagenGeneral(file);
              }}
              className="hidden"
              id="upload-general"
              disabled={uploading}
            />
            <label
              htmlFor="upload-general"
              className={`flex items-center justify-center px-4 py-2 text-sm bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700 transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Subir Nueva Imagen
            </label>
          </div>
          <Button onClick={cargarTodasLasImagenes} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {todasLasImagenes.map((imagen) => (
          <Card key={imagen._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={imagen.url}
                  alt={imagen.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.classList.remove('hidden');
                    }
                  }}
                />
                <div className="hidden text-center text-gray-500 p-4">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Error al cargar</p>
                </div>
              </div>
              
              <div className="p-3">
                <h4 className="text-sm font-medium truncate mb-2" title={imagen.filename}>
                  {imagen.filename}
                </h4>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {secciones.map((seccion) => (
                    <Button
                      key={seccion.seccion}
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 px-2"
                      onClick={() => asignarImagenASeccion(seccion.seccion, imagen.url, imagen._id)}
                      title={`Asignar a ${seccion.titulo}`}
                    >
                      {seccion.titulo.split(' ')[0]}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => copiarUrl(imagen.url)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    URL
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => eliminarImagenGeneral(imagen._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(imagen.upload_date).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {todasLasImagenes.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay imágenes subidas
          </h3>
          <p className="text-gray-600">
            Sube tu primera imagen para comenzar a gestionar el contenido visual.
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin h-8 w-8" />
        <span className="ml-2">Cargando imágenes...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Gestión de Imágenes</h2>
        <p className="text-gray-600">
          Administra las imágenes de tu restaurante de forma organizada e intuitiva
        </p>
      </div>

      {error && (
        <Alert className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categorias" className="flex items-center gap-2">
            <span className="text-lg">🍽️</span>
            Categorías del Menú
          </TabsTrigger>
          <TabsTrigger value="secciones" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Secciones Web
          </TabsTrigger>
          <TabsTrigger value="todas" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Galería de Imágenes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categorias" className="mt-6">
          {renderCategoriasTab()}
        </TabsContent>
        
        <TabsContent value="secciones" className="mt-6">
          {renderSeccionesTab()}
        </TabsContent>
        
        <TabsContent value="todas" className="mt-6">
          {renderTodasLasImagenesTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedImageManager;