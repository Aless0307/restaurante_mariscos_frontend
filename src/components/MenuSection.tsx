import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { restauranteAPI, type CategoriaMenu } from "../services/api";
import { GRADIENT_CLASSES } from "../styles/gradients";

export function MenuSection() {
  const [menuData, setMenuData] = useState<CategoriaMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        setLoading(true);
        console.log('🔄 Intentando cargar menú público...');
        
        // Usar el endpoint público para el menú
        const menuCompleto = await restauranteAPI.getMenuPublico();
        console.log('✅ Menú público cargado:', menuCompleto);
        console.log('📊 Categorías encontradas:', menuCompleto.categorias?.length || 0);
        console.log('📋 Datos de categorías:', menuCompleto.categorias);
        
        setMenuData(menuCompleto.categorias || []);
        setError(null);
      } catch (err) {
        console.error('❌ Error cargando menú público:', err);
        setError('Error al cargar el menú. Intentando con datos de administración...');
        
        // Fallback: intentar cargar desde el endpoint completo (admin)
        try {
          console.log('🔄 Intentando fallback con menú completo...');
          const menuCompleto = await restauranteAPI.getMenuCompleto();
          console.log('✅ Menú completo (fallback) cargado:', menuCompleto);
          
          setMenuData(menuCompleto.categorias);
          setError(null);
        } catch (fallbackErr) {
          console.error('❌ Error en fallback:', fallbackErr);
          setError('No se pudo cargar el menú');
        }
      } finally {
        setLoading(false);
      }
    };

    cargarMenu();
  }, []);

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ CARGANDO MENÚ ✨
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-green-500">Nuestro</span>
              <span className="text-orange-500 ml-2">Menú</span>
            </h2>
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="text-xl text-gray-600">Cargando deliciosos platillos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              ❌ ERROR
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-red-500">Error</span>
              <span className="text-orange-500 ml-2">del Menú</span>
            </h2>
            <p className="text-xl text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Recargar Página
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay datos del menú, mostrar mensaje
  if (!menuData || menuData.length === 0) {
    return (
      <section id="menu" className="py-20 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <div className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              📋 MENÚ VACÍO
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-green-500">Nuestro</span>
              <span className="text-orange-500 ml-2">Menú</span>
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              No se encontraron categorías en el menú. 
              <br />Por favor, agrega categorías desde el panel de administración.
            </p>
            <div className="text-sm text-gray-500">
              Debug: menuData = {JSON.stringify(menuData)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header Elegante */}
        <div className="text-center mb-20">
          {/* Badge mejorado */}
          <div className={`inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-8 py-4 rounded-full text-sm font-bold mb-8 shadow-lg hover:shadow-xl transition-shadow`}>
            <span className="text-2xl animate-pulse">🍽️</span>
            <span>Descubre Nuestros Sabores Únicos</span>
            <span className="text-2xl animate-pulse">🦐</span>
          </div>
          
          {/* Título Principal */}
          <div className="relative mb-6">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Nuestro</span>
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent ml-4">Menú</span>
            </h2>
            {/* Línea decorativa */}
            <div className="flex items-center justify-center mt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-32"></div>
              <div className="mx-4 w-2 h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-32"></div>
            </div>
          </div>
          
          {/* Descripción */}
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Descubre nuestra selección completa de mariscos frescos y platos tradicionales, 
            preparados con más de 50 años de experiencia culinaria
          </p>
          

        </div>

        {/* Menu Book Style */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuData.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md mx-auto w-full">
                {/* Category Header with Image */}
                <div className="relative h-32">
                  <ImageWithFallback
                    src={category.imagen_url_original || 'https://images.unsplash.com/photo-1750271328082-22490577fbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYWZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc1ODIwMjU4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'}
                    alt={`${category.nombre} - Restaurante Dario`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className={`absolute inset-0 bg-opacity-80`} style={{backgroundColor: category.color}}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-3xl mb-2">{category.icono}</div>
                      <h3 className="font-bold text-lg tracking-wider drop-shadow-lg">
                        {category.nombre}
                      </h3>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <CardContent className="p-6">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start py-1">
                        <div className="flex-1 pr-3">
                          <span className={`${
                            item.nombre.startsWith('•') 
                              ? 'ml-4 text-gray-600 text-sm' 
                              : 'text-gray-800 font-medium'
                          }`}>
                            {item.nombre}
                          </span>
                          {item.descripcion && (
                            <span className="text-xs text-gray-500 ml-2 italic">
                              ({item.descripcion})
                            </span>
                          )}
                        </div>
                        {item.precio > 0 && (
                          <span className="font-bold text-green-600 whitespace-nowrap text-lg">
                            ${item.precio}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* WhatsApp Order Section */}
        <div className="mt-16">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Ordena Ahora por WhatsApp!
                </h3>
                <p className="text-gray-600 mb-6">
                  Envíanos un mensaje y te ayudamos con tu pedido. Servicio rápido y confiable.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button 
                  onClick={() => window.open('https://wa.me/522291096048?text=Hola, me gustaría hacer un pedido del menú de Darío Restaurante', '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <span>💬</span>
                  <span>Pedir por WhatsApp</span>
                </button>
                
                <button 
                  onClick={() => window.open('tel:+522291096048', '_blank')}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  <span>📞</span>
                  <span>Llamar Directamente</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">⏰</span>
                  <span>Listo en 30 minutos</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-orange-500">🚗</span>
                  <span>Entrega disponible</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-blue-500">💳</span>
                  <span>Pago en efectivo/transferencia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-500 text-2xl">🦐</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Mariscos Frescos</h4>
            <p className="text-gray-600 text-sm">Productos del mar seleccionados diariamente</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 text-2xl">👨‍🍳</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Preparación Tradicional</h4>
            <p className="text-gray-600 text-sm">Recetas familiares desde 1969</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-500 text-2xl">⚡</span>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Servicio Rápido</h4>
            <p className="text-gray-600 text-sm">Ordena por WhatsApp y recoge en 30 minutos</p>
          </div>
        </div>
      </div>
    </section>
  );
}