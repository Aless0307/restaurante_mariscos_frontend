import { Card, CardContent } from "./ui/card";
import { Clock, Heart, MapPin, Phone, Shield, Star } from "lucide-react";

const features = [
  {
    icon: <Clock className="w-8 h-8 text-green-500" />,
    title: "Horarios Extendidos",
    description: "Abierto todos los días de 9:00 AM a 6:00 PM para tu comodidad",
    highlight: "9 AM - 6 PM"
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Tradición Familiar",
    description: "Más de 50 años sirviendo los mejores mariscos de Veracruz",
    highlight: "Desde 1969"
  },
  {
    icon: <Shield className="w-8 h-8 text-blue-500" />,
    title: "Productos Frescos",
    description: "Mariscos seleccionados diariamente para garantizar frescura",
    highlight: "100% Fresco"
  },
  {
    icon: <Phone className="w-8 h-8 text-orange-500" />,
    title: "Pedidos WhatsApp",
    description: "Ordena fácil y rápido por WhatsApp para recoger o entrega",
    highlight: "Orden Rápida"
  },
  {
    icon: <MapPin className="w-8 h-8 text-purple-500" />,
    title: "Ubicación Ideal",
    description: "Carretera Veracruz-Medellín, fácil acceso y estacionamiento",
    highlight: "Km 2.5"
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: "Especialidades Únicas",
    description: "Platillos exclusivos como 'Camarones a la Darío' y 'Pulpos a la Darío'",
    highlight: "Recetas Únicas"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-green-500">¿Por qué elegir</span>
            <span className="text-orange-500 ml-2">Darío?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La combinación perfecta de tradición, calidad y sabor que nos distingue
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Highlight */}
                <div className="inline-block bg-gradient-to-r from-green-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {feature.highlight}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Vive la experiencia <span className="text-green-500">Darío</span>!
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Te invitamos a disfrutar de nuestros deliciosos mariscos en un ambiente familiar
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://wa.me/522291096048?text=Hola, me gustaría hacer una reservación en Darío Restaurante', '_blank')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg"
              >
                <Phone className="w-5 h-5" />
                <span>Hacer Reservación</span>
              </button>
              
              <button 
                onClick={() => window.open('https://wa.me/522291096048?text=Hola, me gustaría hacer un pedido del menú de Darío Restaurante', '_blank')}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <span>🛍️</span>
                <span>Pedir a Domicilio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}