import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Award, Heart } from "lucide-react";
import { useRestauranteInfo, getImageUrl } from "../hooks/useRestauranteInfo";

export function AboutSection() {
  const { restauranteInfo, loading, connected } = useRestauranteInfo();

  // Si no está conectado al backend, no mostrar nada
  if (!connected || !restauranteInfo) {
    return loading ? (
      <section id="nosotros" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">Cargando información del restaurante...</div>
        </div>
      </section>
    ) : null;
  }

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
      description: restauranteInfo.horarios || "Abierto todos los días"
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
      description: `Más de ${restauranteInfo.anos_experiencia} años sirviendo los mejores mariscos`
    }
  ];

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