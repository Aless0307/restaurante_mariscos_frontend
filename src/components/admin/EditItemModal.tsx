import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface Item {
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: boolean;
  imagen_url?: string;
  imagen_id?: string;
}

interface Categoria {
  id: string;
  nombre: string;
  items?: Item[];
}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  categoryId: string;
  categorias: Categoria[];
  onItemChange: () => void;
}

export function EditItemModal({ 
  isOpen, 
  onClose, 
  item, 
  categoryId, 
  categorias, 
  onItemChange 
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    descripcion: '',
    disponible: true,
    imagen_url: '',
    imagen_id: ''
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagenesDisponibles, setImagenesDisponibles] = useState<any[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        disponible: item.disponible,
        imagen_url: item.imagen_url || '',
        imagen_id: item.imagen_id || ''
      });
    } else {
      setFormData({
        nombre: '',
        precio: 0,
        descripcion: '',
        disponible: true,
        imagen_url: '',
        imagen_id: ''
      });
    }
    setSelectedCategoryId(categoryId);
    cargarImagenes();
  }, [item, categoryId, isOpen]);

  const cargarImagenes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/imagenes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const imagenes = await response.json();
        setImagenesDisponibles(imagenes);
      }
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Para UPDATE: usar categoryId ORIGINAL en la URL
      // Para CREATE: usar selectedCategoryId en la URL
      const urlCategoryId = item ? categoryId : selectedCategoryId;
      
      const url = item 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${urlCategoryId}/items/${item.nombre}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${selectedCategoryId}/items`;
      
      const method = item ? 'PUT' : 'POST';
      
      // Preparar el payload
      let payload: any = {
        nombre: formData.nombre,
        precio: formData.precio,
        descripcion: formData.descripcion,
        disponible: formData.disponible
      };

      // Si estamos editando Y la categoría cambió, incluir categoria_id nuevo
      if (item && selectedCategoryId !== categoryId) {
        payload.categoria_id = selectedCategoryId;
      }

      // Si estamos creando, incluir categoria_id
      if (!item) {
        payload.categoria_id = selectedCategoryId;
      }

      console.log('🔍 DEBUG: Enviando payload para crear/editar item:', payload);
      console.log('🔍 DEBUG: URL:', url);
      console.log('🔍 DEBUG: Method:', method);
      console.log('🔍 DEBUG: Categoría original:', categoryId);
      console.log('🔍 DEBUG: Categoría seleccionada:', selectedCategoryId);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Item guardado exitosamente');
        onItemChange();
        onClose();
      } else {
        const errorText = await response.text();
        console.error('❌ Error guardando item. Status:', response.status, 'Response:', errorText);
        alert(`Error al guardar: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al guardar el item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm('¿Estás seguro de que quieres eliminar este item?')) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${selectedCategoryId}/items/${item.nombre}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (response.ok) {
        onItemChange();
        onClose();
      } else {
        console.error('Error eliminando item');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="bg-white">
          <h3 className="text-lg font-semibold">
            {item ? 'Editar Item' : 'Agregar Nuevo Item'}
          </h3>
        </CardHeader>
        <CardContent className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Imagen - Temporalmente comentado hasta que el backend soporte imágenes en items */}
            {/*
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Item
              </label>
              
              {formData.imagen_url && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${formData.imagen_url}`}
                    alt={formData.nombre}
                    className="w-32 h-24 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowImageSelector(!showImageSelector)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  {formData.imagen_url ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </button>
                {formData.imagen_url && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imagen_url: '', imagen_id: '' }))}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Quitar Imagen
                  </button>
                )}
              </div>
              
              {showImageSelector && (
                <div className="mt-3 p-3 border rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Seleccionar de imágenes disponibles:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {imagenesDisponibles.map((imagen) => (
                      <div
                        key={imagen.id}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            imagen_url: imagen.url,
                            imagen_id: imagen.id
                          }));
                          setShowImageSelector(false);
                        }}
                        className="cursor-pointer border rounded overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                      >
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${imagen.url}`}
                          alt={imagen.filename}
                          className="w-full h-16 object-cover"
                        />
                        <p className="text-xs p-1 bg-white truncate">{imagen.filename}</p>
                      </div>
                    ))}
                  </div>
                  {imagenesDisponibles.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay imágenes disponibles. Ve a la sección "Imágenes" para subir algunas.
                    </p>
                  )}
                </div>
              )}
            </div>
            */}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Item *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Ceviche de pescado"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Descripción del plato..."
              />
            </div>

            {/* Disponible */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponible"
                checked={formData.disponible}
                onChange={(e) => setFormData(prev => ({ ...prev, disponible: e.target.checked }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
                Disponible
              </label>
            </div>

            {/* Vista previa */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Vista previa:</h4>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-medium">{formData.nombre || 'Nombre del item'}</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.descripcion || 'Sin descripción'}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                    formData.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600 ml-4">
                  ${formData.precio.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              {item && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Eliminar
                </button>
              )}
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : item ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}