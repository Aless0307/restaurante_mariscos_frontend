import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface Categoria {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  imagen_url_original?: string;
  activo: boolean;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Categoria | null;
  onCategoryChange: () => void;
}

const coloresDisponibles = [
  { name: 'Rojo', value: 'bg-red-600', hex: '#dc2626' },
  { name: 'Verde', value: 'bg-green-600', hex: '#16a34a' },
  { name: 'Azul', value: 'bg-blue-600', hex: '#2563eb' },
  { name: 'Naranja', value: 'bg-orange-600', hex: '#ea580c' },
  { name: 'Morado', value: 'bg-purple-600', hex: '#9333ea' },
  { name: 'Rosa', value: 'bg-pink-600', hex: '#db2777' },
  { name: 'Índigo', value: 'bg-indigo-600', hex: '#4f46e5' },
  { name: 'Amarillo', value: 'bg-yellow-600', hex: '#ca8a04' },
  { name: 'Gris', value: 'bg-gray-600', hex: '#4b5563' },
  { name: 'Teal', value: 'bg-teal-600', hex: '#0d9488' },
];

const iconosDisponibles = [
  '🥩', '🍤', '🐟', '🦐', '🐙', '🍲', '🍹', '🥗', '🍮', '🥤', 
  '🍺', '🍷', '🌮', '🍕', '🍔', '🍗', '🍜', '🍝', '🥘', '🍛'
];

export function EditCategoryModal({ 
  isOpen, 
  onClose, 
  category, 
  onCategoryChange 
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    color: '#16a34a',
    icono: '🍽️',
    activo: true,
    imagen_url_original: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        nombre: category.nombre,
        color: category.color,
        icono: category.icono,
        activo: category.activo,
        imagen_url_original: category.imagen_url_original || ''
      });
    } else {
      setFormData({
        nombre: '',
        color: '#16a34a',
        icono: '🍽️',
        activo: true,
        imagen_url_original: ''
      });
    }
  }, [category, isOpen]);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = category 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${category.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`;
      
      const method = category ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onCategoryChange();
        onClose();
      } else {
        console.error('Error guardando categoría');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {category ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
          </h3>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: MARISCOS"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de la Categoría
              </label>
              <div className="grid grid-cols-5 gap-2">
                {coloresDisponibles.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({...formData, color: color.value})}
                    className={`w-12 h-12 rounded-lg border-2 ${
                      formData.color === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                    } transition-all`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono de la Categoría
              </label>
              <div className="grid grid-cols-10 gap-2">
                {iconosDisponibles.map((icono) => (
                  <button
                    key={icono}
                    type="button"
                    onClick={() => setFormData({...formData, icono})}
                    className={`w-10 h-10 text-2xl rounded-lg border-2 ${
                      formData.icono === icono ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    } transition-all`}
                  >
                    {icono}
                  </button>
                ))}
              </div>
            </div>

            {/* Imagen URL (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen (opcional)
              </label>
              <input
                type="url"
                value={formData.imagen_url_original || ''}
                onChange={(e) => setFormData({...formData, imagen_url_original: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                Categoría activa en el menú
              </label>
            </div>

            {/* Vista previa */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Vista Previa:</p>
              <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-white" 
                   style={{ backgroundColor: coloresDisponibles.find(c => c.value === formData.color)?.hex }}>
                <span className="text-xl">{formData.icono}</span>
                <span className="font-semibold">{formData.nombre || 'Nombre de Categoría'}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : (category ? 'Guardar Cambios' : 'Crear Categoría')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}