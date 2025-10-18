import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    rating: 5,
    comment: "Los mejores mariscos de Veracruz! El ceviche está increíble y la atención es excelente. Definitivamente regresaré.",
    date: "Hace 2 semanas"
  },
  {
    name: "Carlos Hernández",
    rating: 5,
    comment: "Tradición familiar que se nota en cada platillo. Los camarones a la Dario son una delicia, totalmente recomendado.",
    date: "Hace 1 mes"
  },
  {
    name: "Ana Martínez",
    rating: 5,
    comment: "Excelente servicio y comida fresca. El arroz a la tumbada es espectacular. Precio muy justo para la calidad.",
    date: "Hace 3 semanas"
  },
  {
    name: "Roberto Vásquez",
    rating: 5,
    comment: "Más de 50 años sirviendo los mejores mariscos. La sopa de mariscos es una experiencia única. ¡Gracias Dario!",
    date: "Hace 1 semana"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-green-500">Lo que dicen</span>
            <span className="text-orange-500 ml-2">nuestros clientes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Más de 50 años deleitando paladares veracruzanos
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-0">
                {/* Stars */}
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                {/* Author */}
                <div className="border-t pt-3">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl p-8 max-w-2xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-3">¡Únete a nuestra familia!</h3>
            <p className="mb-6">Comparte tu experiencia en Dario Restaurante</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://www.google.com/search?q=Restaurante+Dario+Veracruz+reviews', '_blank')}
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                ⭐ Déjanos tu reseña
              </button>
              <button 
                onClick={() => window.open('https://instagram.com/restaurante_dario', '_blank')}
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                📸 Síguenos en Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}