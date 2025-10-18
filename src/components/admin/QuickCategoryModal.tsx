import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload, X, Plus } from 'lucide-react';

interface QuickCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: () => void;
}

interface ItemData {
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: boolean;
}

export function QuickCategoryModal({ isOpen, onClose, onCategoryCreated }: QuickCategoryModalProps) {
  const [categoryData, setCategoryData] = useState({
    nombre: '',
    icono: '🍽️',
    color: '#10b981',
    orden: 1,
    activo: true
  });
  
  const [items, setItems] = useState<ItemData[]>([
    { nombre: '', precio: 0, descripcion: '', disponible: true }
  ]);
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Emojis predefinidos para categorías de restaurante (10 por fila, fáciles de usar)
  const predefinedEmojis = [
    '🍽️', '🍴', '🥄', '🥢', '🍤', '🦐', '🦞', '🐙', '🐟', '🐠',
    '🦀', '🐡', '🥩', '🍖', '🍗', '🥓', '🌭', '🍔', '🥪', '🌮',
    '🍲', '🍜', '🍛', '🍱', '🥗', '🍕', '🌯', '🥙', '🧆', '🥘',
    '🍺', '🍻', '🍷', '🥂', '🍸', '🍹', '🥃', '☕', '🍵', '🥤',
    '🧋', '🥛', '🧊', '💧', '🎂', '🍰', '🧁', '🍪', '🍫', '🍬'
  ];

  // Cerrar emoji picker cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([...items, { nombre: '', precio: 0, descripcion: '', disponible: true }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof ItemData, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Validar que al menos un item esté completo
      const validItems = items.filter(item => 
        item.nombre.trim() && item.precio > 0 && item.descripcion.trim()
      );
      
      if (validItems.length === 0) {
        throw new Error('Debes agregar al menos un platillo completo');
      }

      if (!categoryData.nombre.trim()) {
        throw new Error('El nombre de la categoría es requerido');
      }

      let imageUrl = '';

      // 1. Subir imagen si existe
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/upload-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${uploadData.image_url}`;
      }

      // 2. Crear categoría
      const categoryPayload = {
        ...categoryData,
        ...(imageUrl && { imagen_url_original: imageUrl })
      };

      const categoryResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryPayload)
      });

      if (!categoryResponse.ok) {
        throw new Error('Error al crear la categoría');
      }

      const categoryResult = await categoryResponse.json();

      // 3. Agregar items a la categoría
      for (const item of validItems) {
        try {
          // Crear el payload sin categoria_id ya que va en la URL
          const itemPayload = {
            nombre: item.nombre,
            precio: item.precio,
            descripcion: item.descripcion,
            disponible: item.disponible
          };

          console.log('🔍 DEBUG: Enviando item payload:', itemPayload);
          console.log('🔍 DEBUG: URL:', `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoryResult.id}/items`);

          const itemResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias/${categoryResult.id}/items`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(itemPayload)
            }
          );

          if (!itemResponse.ok) {
            const errorText = await itemResponse.text();
            console.error('❌ Error al agregar item:', item.nombre, 'Status:', itemResponse.status, 'Response:', errorText);
            // No lanzar error aquí para que continue con otros items
          } else {
            console.log('✅ Item agregado exitosamente:', item.nombre);
          }
        } catch (itemError) {
          console.error('❌ Error al procesar item:', item.nombre, itemError);
        }
      }

      // Resetear formulario
      setCategoryData({
        nombre: '',
        icono: '🍽️',
        color: '#10b981',
        orden: 1,
        activo: true
      });
      setItems([{ nombre: '', precio: 0, descripcion: '', disponible: true }]);
      setImage(null);
      setImagePreview(null);
      setShowEmojiPicker(false);
      
      onCategoryCreated();
      onClose();
      
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setShowEmojiPicker(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🚀 Crear Categoría Completa</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={uploading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos de la categoría */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">📂 Información de la Categoría</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Categoría *
                  </label>
                  <Input
                    value={categoryData.nombre}
                    onChange={(e) => setCategoryData({...categoryData, nombre: e.target.value})}
                    placeholder="Ej: Mariscos Especiales"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icono
                  </label>
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-2xl no-select"
                        title="Seleccionar emoji"
                      >
                        {categoryData.icono}
                      </button>
                      <Input
                        value={categoryData.icono}
                        onChange={(e) => setCategoryData({...categoryData, icono: e.target.value})}
                        placeholder="🍤"
                        maxLength={4}
                        className="flex-1"
                      />
                    </div>
                    
                    {/* Selector de emojis optimizado */}
                    {showEmojiPicker && (
                      <div 
                        ref={emojiPickerRef}
                        className="emoji-picker absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-3"
                      >
                        <div className="text-xs text-gray-600 mb-2 font-medium">
                          🎭 Selecciona un emoji (50 opciones, scroll para ver más):
                        </div>
                        <div className="emoji-grid-container">
                          {predefinedEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setCategoryData({...categoryData, icono: emoji});
                                setShowEmojiPicker(false);
                              }}
                              className="emoji-button text-lg hover:bg-gray-100 rounded border border-transparent hover:border-gray-300 no-select"
                              title={`Seleccionar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(false)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                          >
                            ✖️ Cerrar selector
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <Input
                    type="color"
                    value={categoryData.color}
                    onChange={(e) => setCategoryData({...categoryData, color: e.target.value})}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden
                  </label>
                  <Input
                    type="number"
                    value={categoryData.orden}
                    onChange={(e) => setCategoryData({...categoryData, orden: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
              </div>

              {/* Imagen */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de la Categoría
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="category-image"
                  />
                  <label
                    htmlFor="category-image"
                    className="cursor-pointer bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Seleccionar Imagen</span>
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">🍽️ Platillos (mínimo 1)</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Platillo</span>
                </Button>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto admin-scroll-container">
                {items.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded border">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Platillo #{index + 1}</h4>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="admin-button text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Platillo *
                        </label>
                        <Input
                          value={item.nombre}
                          onChange={(e) => updateItem(index, 'nombre', e.target.value)}
                          placeholder="Ej: Camarones al Ajillo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio *
                        </label>
                        <Input
                          type="number"
                          value={item.precio}
                          onChange={(e) => updateItem(index, 'precio', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción *
                        </label>
                        <Textarea
                          value={item.descripcion}
                          onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                          placeholder="Describe los ingredientes y preparación..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploading ? 'Creando...' : '🚀 Crear Categoría Completa'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}