import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Award, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface RestauranteInfo {
  nombre: string;
  descripcion_larga: string;
  imagen_sobre_nosotros_url: string;
  anos_experiencia: number;
  clientes_satisfechos: number;
  platos_unicos: number;
  calificacion: number;
}

export function AboutSection() {
  const [restauranteInfo, setRestauranteInfo] = useState<RestauranteInfo>({
    nombre: "Restaurante Dario",
    descripcion_larga: "Restaurante Dario, llevamos más de dos décadas dedicados a ofrecer la mejor experiencia gastronómica de mariscos.",
    imagen_sobre_nosotros_url: "https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzU3MzcyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    anos_experiencia: 20,
    clientes_satisfechos: 10000,
    platos_unicos: 50,
    calificacion: 4.8
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarInfoRestaurante();
  }, []);

  // Función para construir URLs de imágenes
  const getImageUrl = (url: string): string => {
    if (!url) return '';
    
    // Si la URL empieza con /api/ (GridFS) o es http/https, la usamos tal como está
    if (url.startsWith('/api/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es una ruta relativa que empieza con /, asumimos que está en public
    if (url.startsWith('/')) {
      return url;
    }
    
    // Si es solo el nombre del archivo, asumimos que está en public
    return `/${url}`;
  };

  const cargarInfoRestaurante = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/restaurante/info-publica`);
      
      if (response.ok) {
        const data = await response.json();
        setRestauranteInfo({
          nombre: data.nombre || "Dario Restaurante",
          descripcion_larga: data.descripcion_completa || "En Dario Restaurante, llevamos más de dos décadas dedicados a ofrecer la mejor experiencia gastronómica de mariscos.",
          imagen_sobre_nosotros_url: data.imagen_sobre_nosotros_url || "https://images.unsplash.com/photo-1730698306944-544a5cb282e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYWZvb2QlMjBwbGF0dGVyJTIwc2hyaW1wJTIwbG9ic3RlcnxlbnwxfHx8fDE3NTgwNTg0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          anos_experiencia: data.experiencia_anos || 20,
          clientes_satisfechos: data.clientes_satisfechos || 10000,
          platos_unicos: data.platos_disponibles || 50,
          calificacion: data.calificacion || 4.8
        });
        console.log('✅ Información del restaurante cargada en AboutSection:', data);
      } else {
        console.warn('⚠️ No se pudo cargar la información del restaurante, usando valores por defecto');
      }
    } catch (error) {
      console.error('❌ Error cargando información del restaurante:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear número de clientes (10000 -> 10k+)
  const formatearClientes = (numero: number) => {
    if (numero >= 1000) {
      return `${Math.floor(numero / 1000)}k+`;
    }
    return `${numero}+`;
  };

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Horarios Flexibles",
      description: "Abierto todos los días de 9:00 AM a 6:00 PM"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Capacidad Amplia",
      description: "Espacio para 150 comensales en un ambiente acogedor"
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      title: "Calidad Garantizada",
      description: "Mariscos frescos seleccionados diariamente"
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Tradición Familiar",
      description: "Más de 20 años sirviendo los mejores mariscos"
    }
  ];

  if (loading) {
    return (
      <section id="nosotros" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">Cargando información del restaurante...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-green-500">Sobre</span>
              <span className="text-orange-500 ml-2">Nosotros</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              En <strong>{restauranteInfo.nombre}</strong>, llevamos más de dos décadas dedicados a 
              ofrecer la mejor experiencia gastronómica de mariscos. Nuestra pasión por 
              los productos del mar nos ha convertido en el destino favorito para los 
              amantes de los mariscos frescos.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {restauranteInfo.descripcion_larga}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {feature.icon}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback 
                src={getImageUrl(restauranteInfo.imagen_sobre_nosotros_url)}
                alt={`Interior del ${restauranteInfo.nombre}`}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay with stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-3 gap-4 text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{restauranteInfo.anos_experiencia}+</div>
                    <div className="text-sm">Años de Experiencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{formatearClientes(restauranteInfo.clientes_satisfechos)}</div>
                    <div className="text-sm">Clientes Satisfechos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{restauranteInfo.platos_unicos}+</div>
                    <div className="text-sm">Platos Únicos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}