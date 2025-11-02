import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface Category {
  id: number;
  nombre: string;
  color: string;
  icono: string;
  activo: boolean;
  imagen_url?: string;
  imagen_url_original?: string;
}

interface EditCategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (updatedCategory: Partial<Category>) => Promise<void>;
}

const coloresDisponibles = [
  { name: 'Rojo', value: 'red', hex: '#ef4444' },
  { name: 'Verde', value: 'green', hex: '#22c55e' },
  { name: 'Azul', value: 'blue', hex: '#3b82f6' },
  { name: 'Naranja', value: 'orange', hex: '#f97316' },
  { name: 'Morado', value: 'purple', hex: '#a855f7' },
  { name: 'Rosa', value: 'pink', hex: '#ec4899' },
  { name: 'Índigo', value: 'indigo', hex: '#6366f1' },
  { name: 'Amarillo', value: 'yellow', hex: '#eab308' },
  { name: 'Gris', value: 'gray', hex: '#6b7280' },
  { name: 'Teal', value: 'teal', hex: '#14b8a6' },
];

const iconosDisponibles = [
  '🥩', '🍤', '🐟', '🦐', '🐙', '🍲', '🍹', '🥗', '🍮', '🥤', '🍺', '🍷',
  '🌮', '🍕', '🍔', '🍗', '🍜', '🍝', '🥘', '🍛'
];

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    color: 'green',
    icono: '🥩',
    activo: true,
    imagen_url_original: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        nombre: category.nombre,
        color: category.color,
        icono: category.icono,
        activo: category.activo,
        imagen_url_original: category.imagen_url_original || category.imagen_url || '',
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl">
        <CardHeader className="border-b px-2 py-1.5 bg-white flex-shrink-0">
          <h3 className="text-[11px] font-bold text-gray-800">
            {category ? 'Editar' : 'Nueva'} Categoría
          </h3>
        </CardHeader>
        
        <CardContent className="p-2 overflow-y-auto flex-1 bg-white">
          <form onSubmit={handleSubmit} className="space-y-1.5">
            <div>
              <label className="block text-[9px] font-medium text-gray-700 mb-0.5">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-1.5 py-0.5 border border-gray-300 rounded text-[11px]"
                placeholder="Ej: MARISCOS"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-medium text-gray-700 mb-0.5">Color</label>
              <div className="grid grid-cols-5 gap-0.5">
                {coloresDisponibles.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({...formData, color: color.value})}
                    className={`h-4 rounded ${
                      formData.color === color.value ? 'ring-2 ring-gray-800 ring-offset-1' : 'border border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-medium text-gray-700 mb-0.5">Icono</label>
              <div className="p-1 bg-gray-50 rounded border border-gray-200 max-h-14 overflow-y-auto">
                <div className="grid grid-cols-10 gap-0.5">
                  {iconosDisponibles.map((icono) => (
                    <button
                      key={icono}
                      type="button"
                      onClick={() => setFormData({...formData, icono})}
                      className={`h-4 text-[10px] rounded ${
                        formData.icono === icono 
                          ? 'bg-green-100 ring-1 ring-green-500' 
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {icono}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-medium text-gray-700 mb-0.5">URL (opcional)</label>
              <input
                type="url"
                value={formData.imagen_url_original || ''}
                onChange={(e) => setFormData({...formData, imagen_url_original: e.target.value})}
                className="w-full px-1.5 py-0.5 border border-gray-300 rounded text-[11px]"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                className="w-2.5 h-2.5"
              />
              <label htmlFor="activo" className="text-[9px] text-gray-700">Activa</label>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded">
              <p className="text-[9px] font-medium text-gray-600 mb-0.5">Preview:</p>
              <div 
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded shadow-sm" 
                style={{ backgroundColor: coloresDisponibles.find(c => c.value === formData.color)?.hex }}
              >
                <span className="text-[11px]">{formData.icono}</span>
                <span className="font-bold text-[9px] text-white">{formData.nombre || 'Categoría'}</span>
              </div>
            </div>
          </form>
        </CardContent>

        <div className="border-t px-2 py-1 bg-white flex gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-2 py-0.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-[10px] font-medium"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600 disabled:opacity-50 text-[10px] font-medium"
          >
            {isSubmitting ? '...' : (category ? 'Guardar' : 'Crear')}
          </button>
        </div>
      </Card>
    </div>
  );
};
