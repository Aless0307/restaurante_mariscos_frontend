import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface RestauranteInfoEditorProps {
  token: string;
}

interface RestauranteInfo {
  id?: string;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  facebook: string;
  instagram: string;
  website: string;
  logo_url: string;
  imagen_banner_url: string;
  imagen_sobre_nosotros_url: string;
  anos_experiencia: number;
  clientes_satisfechos: number;
  platos_unicos: number;
}

export function RestauranteInfoEditor({ token }: RestauranteInfoEditorProps) {
  const [info, setInfo] = useState<RestauranteInfo>({
    nombre: '',
    descripcion_corta: '',
    descripcion_larga: '',
    telefono: '',
    whatsapp: '',
    email: '',
    direccion: '',
    horarios: '',
    facebook: '',
    instagram: '',
    website: '',
    logo_url: '',
    imagen_banner_url: '',
    imagen_sobre_nosotros_url: '',
    anos_experiencia: 20,
    clientes_satisfechos: 10000,
    platos_unicos: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState({
    logo: false,
    banner: false,
    sobre_nosotros: false
  });

  useEffect(() => {
    cargarInfoRestaurante();
  }, []);

  const cargarInfoRestaurante = async () => {
    try {
      console.log('🔄 Cargando información del restaurante...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/restaurante`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos del servidor:', data);
        setInfo(data);
      } else {
        console.error('❌ Error en respuesta:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error cargando información del restaurante:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/restaurante`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
      });

      if (response.ok) {
        alert('Información del restaurante actualizada exitosamente');
      } else {
        alert('Error actualizando la información');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error actualizando la información');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof RestauranteInfo, value: string | number) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File, imageType: 'logo' | 'banner' | 'sobre_nosotros') => {
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.)');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [imageType]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = `/api/imagenes/${data.image_id}`;
        
        // Actualizar la URL correspondiente
        const fieldMap = {
          logo: 'logo_url',
          banner: 'imagen_banner_url',
          sobre_nosotros: 'imagen_sobre_nosotros_url'
        };
        
        handleChange(fieldMap[imageType] as keyof RestauranteInfo, imageUrl);
        console.log(`✅ ${imageType} subido exitosamente:`, imageUrl);
        
        // Mostrar mensaje de éxito
        alert('Imagen subida exitosamente. No olvides guardar los cambios.');
      } else {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error(`Error subiendo ${imageType}:`, error);
      alert(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageType]: false }));
    }
  };

  const triggerFileInput = (imageType: 'logo' | 'banner' | 'sobre_nosotros') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file, imageType);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Información del Restaurante</h3>
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Información del Restaurante</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de edición */}
        <Card>
          <CardHeader>
            <h4 className="font-semibold">Editar Información</h4>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Información básica */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Restaurante *
                </label>
                <input
                  type="text"
                  value={info.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta *
                </label>
                <input
                  type="text"
                  value={info.descripcion_corta}
                  onChange={(e) => handleChange('descripcion_corta', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Auténtica comida peruana"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Larga
                </label>
                <textarea
                  value={info.descripcion_larga}
                  onChange={(e) => handleChange('descripcion_larga', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descripción detallada del restaurante..."
                />
              </div>

              {/* Información de contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={info.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+51 123 456 789"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={info.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+51 987 654 321"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={info.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="contacto@restaurante.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={info.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Av. Principal 123, Lima, Perú"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horarios *
                </label>
                <input
                  type="text"
                  value={info.horarios}
                  onChange={(e) => handleChange('horarios', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Lunes a Domingo: 12:00 PM - 10:00 PM"
                  required
                />
              </div>

              {/* Redes sociales */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Redes Sociales (opcional)</h5>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={info.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://facebook.com/restaurante"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={info.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://instagram.com/restaurante"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={info.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://restaurante.com"
                  />
                </div>
              </div>

              {/* URLs de imágenes */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900">Imágenes</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Puedes escribir URLs directamente o usar el botón "📁 Subir" para cargar imágenes desde tu PC
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Logo
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={info.logo_url}
                      onChange={(e) => handleChange('logo_url', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="/logo-cangrejo.png o https://ejemplo.com/logo.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileInput('logo')}
                      disabled={uploadingImages.logo}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImages.logo ? 'Subiendo...' : '📁 Subir'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen Banner
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={info.imagen_banner_url}
                      onChange={(e) => handleChange('imagen_banner_url', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/banner.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileInput('banner')}
                      disabled={uploadingImages.banner}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImages.banner ? 'Subiendo...' : '📁 Subir'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen "Sobre Nosotros"
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={info.imagen_sobre_nosotros_url}
                      onChange={(e) => handleChange('imagen_sobre_nosotros_url', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/interior-restaurante.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileInput('sobre_nosotros')}
                      disabled={uploadingImages.sobre_nosotros}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingImages.sobre_nosotros ? 'Subiendo...' : '📁 Subir'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Estadísticas "Sobre Nosotros"</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Años de Experiencia
                    </label>
                    <input
                      type="number"
                      value={info.anos_experiencia}
                      onChange={(e) => handleChange('anos_experiencia', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="20"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clientes Satisfechos
                    </label>
                    <input
                      type="number"
                      value={info.clientes_satisfechos}
                      onChange={(e) => handleChange('clientes_satisfechos', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="10000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platos Únicos
                    </label>
                    <input
                      type="number"
                      value={info.platos_unicos}
                      onChange={(e) => handleChange('platos_unicos', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="50"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Vista previa */}
        <Card>
          <CardHeader>
            <h4 className="font-semibold">Vista Previa</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Header de vista previa */}
              <div className="text-center border-b pb-4">
                {info.logo_url && (
                  <img 
                    src={
                      info.logo_url.startsWith('http') 
                        ? info.logo_url 
                        : info.logo_url.startsWith('/api/')
                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${info.logo_url}`
                        : info.logo_url.startsWith('/') 
                        ? info.logo_url
                        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${info.logo_url}`
                    }
                    alt="Logo"
                    className="h-16 mx-auto mb-2"
                    onError={(e) => {
                      console.warn('❌ Error cargando logo:', info.logo_url);
                      console.warn('❌ URL final:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid red';
                    }}
                    onLoad={() => {
                      console.log('✅ Logo cargado exitosamente:', info.logo_url);
                    }}
                  />
                )}
                <h2 className="text-2xl font-bold text-green-600">
                  {info.nombre || 'Nombre del Restaurante'}
                </h2>
                <p className="text-gray-600">
                  {info.descripcion_corta || 'Descripción corta'}
                </p>
              </div>

              {/* Banner */}
              {info.imagen_banner_url && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={
                      info.imagen_banner_url.startsWith('http') 
                        ? info.imagen_banner_url 
                        : info.imagen_banner_url.startsWith('/api/')
                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${info.imagen_banner_url}`
                        : info.imagen_banner_url.startsWith('/') 
                        ? info.imagen_banner_url
                        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${info.imagen_banner_url}`
                    }
                    alt="Banner"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      console.warn('❌ Error cargando banner:', info.imagen_banner_url);
                      console.warn('❌ URL final:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid red';
                    }}
                    onLoad={() => {
                      console.log('✅ Banner cargado exitosamente:', info.imagen_banner_url);
                    }}
                  />
                </div>
              )}

              {/* Información de contacto */}
              <div className="space-y-2">
                <h5 className="font-medium">Información de Contacto:</h5>
                <div className="text-sm space-y-1">
                  <p>📍 {info.direccion || 'Dirección'}</p>
                  <p>📞 {info.telefono || 'Teléfono'}</p>
                  <p>📱 {info.whatsapp || 'WhatsApp'}</p>
                  <p>✉️ {info.email || 'Email'}</p>
                  <p>🕒 {info.horarios || 'Horarios'}</p>
                </div>
              </div>

              {/* Redes sociales */}
              {(info.facebook || info.instagram || info.website) && (
                <div className="space-y-2">
                  <h5 className="font-medium">Redes Sociales:</h5>
                  <div className="flex space-x-2">
                    {info.facebook && (
                      <a href={info.facebook} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        📘 Facebook
                      </a>
                    )}
                    {info.instagram && (
                      <a href={info.instagram} target="_blank" rel="noopener noreferrer"
                         className="text-pink-600 hover:text-pink-800">
                        📷 Instagram
                      </a>
                    )}
                    {info.website && (
                      <a href={info.website} target="_blank" rel="noopener noreferrer"
                         className="text-green-600 hover:text-green-800">
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Descripción larga */}
              {info.descripcion_larga && (
                <div className="space-y-2">
                  <h5 className="font-medium">Acerca de nosotros:</h5>
                  <p className="text-sm text-gray-600">{info.descripcion_larga}</p>
                </div>
              )}

              {/* Imagen y estadísticas "Sobre nosotros" */}
              {info.imagen_sobre_nosotros_url && (
                <div className="space-y-2">
                  <h5 className="font-medium">Sección "Sobre Nosotros":</h5>
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={
                        info.imagen_sobre_nosotros_url.startsWith('http') 
                          ? info.imagen_sobre_nosotros_url 
                          : info.imagen_sobre_nosotros_url.startsWith('/api/')
                          ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${info.imagen_sobre_nosotros_url}`
                          : info.imagen_sobre_nosotros_url.startsWith('/') 
                          ? info.imagen_sobre_nosotros_url
                          : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${info.imagen_sobre_nosotros_url}`
                      }
                      alt="Sobre nosotros"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        console.warn('❌ Error cargando imagen sobre nosotros:', info.imagen_sobre_nosotros_url);
                        e.currentTarget.style.border = '2px solid red';
                      }}
                      onLoad={() => {
                        console.log('✅ Imagen sobre nosotros cargada exitosamente:', info.imagen_sobre_nosotros_url);
                      }}
                    />
                    
                    {/* Overlay con estadísticas como en la página real */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="grid grid-cols-3 gap-2 text-white text-xs">
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-400">{info.anos_experiencia}+</div>
                          <div className="text-xs">Años</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{(info.clientes_satisfechos / 1000).toFixed(0)}k+</div>
                          <div className="text-xs">Clientes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-400">{info.platos_unicos}+</div>
                          <div className="text-xs">Platos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}