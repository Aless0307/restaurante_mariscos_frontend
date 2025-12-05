import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Isolde Cancino",
    rating: 5,
    comment: "¡Altamente recomendable! El Restaurante Dario es de mis lugares favoritos. Siempre que voy, la comida está deliciosa, el servicio es excelente y el ambiente muy agradable. Los mariscos son frescos, bien servidos y con muchísimo sabor.",
    date: "Hace 5 meses",
    verified: "Local Guide · 311 opiniones"
  },
  {
    name: "ElAbuelo Mx",
    rating: 5,
    comment: "Me ha encantado la comida. Probé Camarones Enchilpayados y me encantaron, he probado en muchos lugares de la ciudad antes de conocer aquí y no me equivoco en afirmar que son los mejores. La salsa muy rica, consistente y con un picor extraordinario de verdadero enchilpayado.",
    date: "Hace un año",
    verified: "Local Guide · 284 opiniones"
  },
  {
    name: "Kamir R M",
    rating: 5,
    comment: "Lo mejor de la región en cuanto a mariscos, área especial climatizada, juegos para niños, estacionamiento amplio, el servicio súper rápido, atención de primera. INFINITAMENTE RECOMENDADO.",
    date: "Hace un año",
    verified: "Google Reviews"
  },
  {
    name: "Mónica Lugo Álvarez",
    rating: 5,
    comment: "Excelente Restaurant, todos sus platillos preparados al momento y con un sabor excepcional! El tamal de barbacoa una delicia, consomé de camarón y ensalada de caracol fileteado y camarón super rico!!! Excelente atención y precios!!! 💯👏🏼👌🏼",
    date: "Hace 3 años",
    verified: "Local Guide · 55 opiniones"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-orange-400 to-green-500"></div>
              
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="mb-4">
                  <svg className="w-10 h-10 text-orange-200 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-gray-700 mb-6 text-sm leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                
                {/* Author */}
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 aspect-square rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-800 text-sm leading-tight">{testimonial.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{testimonial.date}</p>
                    </div>
                  </div>
                  {testimonial.verified && (
                    <div className="flex items-center gap-1 mt-3 ml-1">
                      <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs text-green-600 font-medium">{testimonial.verified}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-green-600 rounded-2xl p-8 max-w-2xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-3">¡Únete a nuestra familia!</h3>
            <p className="mb-6">Comparte tu experiencia en Restaurante Dario</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://www.google.com/search?q=Restaurante+Dario+Veracruz&sca_esv=6e39c7eb808723cd&sxsrf=AE3TifNBMzZl3ttGRO_ueyiDGSEZj_3jog%3A1761519063304&ei=16X-aI-xEuijkPIPqtrb6Aw&ved=0ahUKEwjP-KHw-cKQAxXoEUQIHSrtFs0Q4dUDCBE&uact=5&oq=Restaurante+Dario+Veracruz&gs_lp=Egxnd3Mtd2l6LXNlcnAiGlJlc3RhdXJhbnRlIERhcmlvIFZlcmFjcnV6MgQQIxgnMgUQABiABDIGEAAYFhgeMgYQABgWGB4yCBAAGIAEGKIEMggQABiABBiiBEi1BVDXA1jXA3ABeAGQAQCYAYgBoAGIAaoBAzAuMbgBA8gBAPgBAZgCAqACpAHCAgoQABiwAxjWBBhHmAMAiAYBkAYIkgcDMS4xoAflBLIHAzAuMbgHlQHCBwMzLTLIBxU&sclient=gws-wiz-serp&lqi=ChpSZXN0YXVyYW50ZSBEYXJpbyBWZXJhY3J1ekiS__3Ox6uAgAhaMhAAEAEQAhgAGAEYAiIacmVzdGF1cmFudGUgZGFyaW8gdmVyYWNydXoqCAgCEAAQARACkgESc2VhZm9vZF9yZXN0YXVyYW50mgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVVJWZERkbFRreFJFQUWqAUMQATIfEAEiG-JUnXDw7Z7K66rHj_1iUEJaGgBbNMHaRdjXATIeEAIiGnJlc3RhdXJhbnRlIGRhcmlvIHZlcmFjcnV6-gEFCKwBED4#rlimm=4436740723205357158&lrd=0x85c3418b05a3fc41:0x3d92782e4f2a3e66,3,,,,', '_blank')}
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