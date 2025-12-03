import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface Category {
  id: string | number;
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

const emojiCategories = [
  {
    name: "Principales",
    emojis: ['🥩', '🍗', '🍔', '🍕', '🌮', '🌯', '🥗', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🍤', '🍚']
  },
  {
    name: "Mariscos",
    emojis: ['🐟', '🐙', '🦀', '🦞', '🦐', '🦑', '🐚']
  },
  {
    name: "Bebidas",
    emojis: ['☕', '🍵', '🥤', '🧃', '🍺', '🍷', '🍹', '🥂', '🥃', '🍸', '🍾']
  },
  {
    name: "Postres",
    emojis: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮']
  },
  {
    name: "Frutas y Verduras",
    emojis: ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥦', '🍄']
  }
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {category ? 'Editar' : 'Nueva'} Categoría
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="sr-only">Cerrar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre de la Categoría</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                placeholder="Ej: MARISCOS"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selecciona un Icono</label>
              <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-3 custom-scrollbar">
                {emojiCategories.map((cat) => (
                  <div key={cat.name} className="mb-3 last:mb-0">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-gray-50 py-1 z-10">
                      {cat.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.emojis.map((icono) => (
                        <button
                          key={icono}
                          type="button"
                          onClick={() => setFormData({...formData, icono})}
                          className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all duration-200 ${
                            formData.icono === icono 
                              ? 'bg-white shadow-md ring-2 ring-orange-500 scale-110 z-10' 
                              : 'hover:bg-white hover:shadow-sm hover:scale-105 bg-white/50 border border-transparent hover:border-gray-200'
                          }`}
                        >
                          {icono}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL de Imagen (opcional)</label>
              <input
                type="url"
                value={formData.imagen_url_original || ''}
                onChange={(e) => setFormData({...formData, imagen_url_original: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-orange-500 checked:bg-orange-500"
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <label htmlFor="activo" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Categoría Visible en el Menú
              </label>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-100">
              <p className="text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">Vista Previa</p>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-orange-100 flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-full text-3xl">
                  {formData.icono}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-base leading-tight">
                    {formData.nombre || 'Nombre de Categoría'}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-1 ${formData.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {formData.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm font-medium"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none text-sm font-medium"
          >
            {isSubmitting ? 'Guardando...' : (category ? 'Guardar Cambios' : 'Crear Categoría')}
          </button>
        </div>
      </div>
    </div>
  );
};
