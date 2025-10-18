import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface ImageManagerProps {
  token: string;
}

interface ImageFile {
  id: string;
  filename: string;
  upload_date: string;
  length: number;
  content_type: string;
  url: string;
}

export function ImageManager({ token }: ImageManagerProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/imagenes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
    
    setUploading(false);
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/imagenes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        await loadImages(); // Recargar la lista
      } else {
        const error = await response.json();
        alert(`Error subiendo imagen: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error subiendo la imagen');
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/imagenes/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== imageId));
      } else {
        alert('Error eliminando la imagen');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error eliminando la imagen');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Gestión de Imágenes</h3>
      
      {/* Área de subida */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold">Subir Nuevas Imágenes</h4>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className="text-4xl">📸</div>
              <div>
                <p className="text-lg font-medium">
                  {dragOver ? 'Suelta las imágenes aquí' : 'Arrastra y suelta imágenes aquí'}
                </p>
                <p className="text-gray-600">o</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? 'Subiendo...' : 'Seleccionar Archivos'}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Formatos soportados: JPG, PNG, GIF (máx. 5MB cada una)
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Galería de imágenes */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <h4 className="font-semibold">Imágenes Subidas ({images.length})</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-2 hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative group">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${image.url}`}
                      alt={image.filename}
                      className="max-w-full max-h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling!.textContent = '❌ Error cargando imagen';
                      }}
                    />
                    <div className="text-gray-500 text-sm hidden">❌ Error cargando imagen</div>
                    
                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${image.url}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        title="Copiar URL"
                      >
                        📋 Copiar URL
                      </button>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        title="Eliminar imagen"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(image.length)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Subido: {new Date(image.upload_date).toLocaleDateString()}
                    </p>
                    
                    {/* URL de la imagen para copiar */}
                    <div className="mt-2">
                      <input
                        type="text"
                        value={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${image.url}`}
                        readOnly
                        className="w-full text-xs p-1 border rounded bg-gray-50 select-all"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado vacío */}
      {images.length === 0 && !uploading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h4 className="text-lg font-semibold mb-2">No hay imágenes</h4>
            <p className="text-gray-600">Sube tu primera imagen para comenzar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}