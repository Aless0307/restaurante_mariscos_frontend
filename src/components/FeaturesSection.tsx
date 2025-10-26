import { Card, CardContent } from "./ui/card";
import { Clock, Heart, MapPin, Phone } from "lucide-react";
import { GRADIENT_CLASSES } from "../styles/gradients";

const features = [
  {
    icon: <Clock className="w-8 h-8 text-green-500" />,
    title: "Horarios Extendidos",
    description: "Abierto todos los días de 9:00 AM a 6:00 PM para tu comodidad",
    highlight: "9 AM - 6 PM"
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Pedidos WhatsApp",
    description: "Ordena fácil y rápido por WhatsApp para recoger o entrega",
    highlight: "Orden Rápida"
  },
  {
    icon: <Phone className="w-8 h-8 text-orange-500" />,
    title: "Ubicación Ideal",
    description: "Carretera Veracruz-Medellín, fácil acceso y estacionamiento",
    highlight: "Km 2.5"
  },
  {
    icon: <MapPin className="w-8 h-8 text-purple-500" />,
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
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-semibold"
                 style={{background: 'linear-gradient(to right, rgb(22, 163, 74), rgb(34, 197, 94))'}}>
              {feature.highlight}
            </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}