import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { useRestauranteInfo, getImageUrl } from "../hooks/useRestauranteInfo";

export function Footer() {
  const { restauranteInfo, loading, connected } = useRestauranteInfo();

  // Si no está conectado al backend, no mostrar nada
  if (!connected || !restauranteInfo) {
    return loading ? (
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600">Cargando información del restaurante...</div>
        </div>
      </footer>
    ) : null;
  }

  const nombrePartes = restauranteInfo.nombre.split(' ');
  const primerNombre = nombrePartes[0] || "";
  const restoNombre = nombrePartes.slice(1).join(' ') || "";

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={getImageUrl(restauranteInfo.logo_url)} 
                alt={`${restauranteInfo.nombre} Logo`}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-green-400">{primerNombre}</span>
                </h2>
                {restoNombre && (
                  <p className="text-orange-400 text-sm">{restoNombre}</p>
                )}
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              {restauranteInfo.descripcion_corta}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {restauranteInfo.instagram && (
                <button 
                  onClick={() => window.open(restauranteInfo.instagram, '_blank')}
                  className="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </button>
              )}
              {restauranteInfo.facebook && (
                <button 
                  onClick={() => window.open(restauranteInfo.facebook, '_blank')}
                  className="bg-gray-800 hover:bg-orange-500 p-3 rounded-full transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
              )}
              {restauranteInfo.whatsapp && (
                <button 
                  onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank')}
                  className="bg-green-500 hover:bg-green-600 p-3 rounded-full transition-colors"
                >
                  <span className="text-white">💬</span>
                </button>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">Contacto</h3>
            <div className="space-y-3">
              {restauranteInfo.direccion && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="text-gray-300">{restauranteInfo.nombre}</p>
                    <p className="text-gray-300">{restauranteInfo.direccion}</p>
                  </div>
                </div>
              )}
              
              {restauranteInfo.telefono && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <p className="text-gray-300">{restauranteInfo.telefono}</p>
                </div>
              )}
              
              {restauranteInfo.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <p className="text-gray-300">{restauranteInfo.email}</p>
                </div>
              )}
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
                  <p className="text-white">{restauranteInfo.horarios}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Section */}
        {restauranteInfo.whatsapp && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">¿Listo para ordenar?</h3>
              <p className="mb-4 text-green-100">Contacta con nosotros por WhatsApp para hacer tu pedido</p>
              <button 
                onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}?text=Hola, me gustaría hacer una reserva en ${restauranteInfo.nombre}`, '_blank')}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 transition-colors"
              >
                <span>💬</span>
                <span>Escribir por WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © 2025 <span className="text-green-400">{primerNombre}</span> {restoNombre && <span className="text-orange-400">{restoNombre}</span>}. 
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}