import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import logo from "figma:asset/9e3fb91044d97a7f4be76c9eab3f4e7c4e7a4aa8.png";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logo} 
                alt="Restaurante Dario Logo"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-green-400">Dario</span>
                </h2>
                <p className="text-orange-400 text-sm">Restaurante</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Desde 1969 sirviendo los mariscos más frescos y deliciosos. 
              Una experiencia gastronómica única que combina tradición y calidad familiar.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <button 
                onClick={() => window.open('https://instagram.com/restaurante_dario', '_blank')}
                className="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button className="bg-gray-800 hover:bg-orange-500 p-3 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open('https://wa.me/522291096048', '_blank')}
                className="bg-green-500 hover:bg-green-600 p-3 rounded-full transition-colors"
              >
                <span className="text-white">💬</span>
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <p className="text-gray-300">Restaurant Familiar Dario</p>
                  <p className="text-gray-300">Carr. Veracruz - Medellin km 2.5</p>
                  <p className="text-gray-300">91966 Veracruz, Ver.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <p className="text-gray-300">+52 229 109 6048</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <p className="text-gray-300">restaurantedario1@outlook.com</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">Horarios</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-gray-300 text-sm">Todos los días</p>
                  <p className="text-white">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">¿Listo para ordenar?</h3>
            <p className="mb-4 text-green-100">Contacta con nosotros por WhatsApp para hacer tu pedido</p>
            <button 
              onClick={() => window.open('https://wa.me/522291096048?text=Hola, me gustaría hacer una reserva en Dario Restaurante', '_blank')}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 transition-colors"
            >
              <span>💬</span>
              <span>Escribir por WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © 2024 <span className="text-green-400">Dario</span> <span className="text-orange-400">Restaurante</span>. 
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}