import { Button } from "./ui/button";
import { Menu, Phone, Settings, X } from "lucide-react";
import { useState } from "react";
import { useRestauranteInfo, getImageUrl } from "../hooks/useRestauranteInfo";

interface HeaderProps {
  onAdminClick?: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const { restauranteInfo, loading, connected } = useRestauranteInfo();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  
  // Función para manejar llamada en PC y móvil
  const handleCall = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const phoneNumber = restauranteInfo.telefono;
    
    if (isMobile) {
      // En móvil, abre la aplicación de teléfono
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // En PC, muestra un modal o abre el cliente de VoIP si está disponible
      // Intenta abrir Skype si está disponible
      const skypeUrl = `skype:${phoneNumber}?call`;
      window.location.href = skypeUrl;
    }
  };

  // Manejador secreto para admin (triple click en logo)
  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    
    if (newClicks >= 3) {
      onAdminClick?.();
      setLogoClicks(0);
    }
    
    // Resetear contador después de 2 segundos si no se completa la secuencia
    setTimeout(() => {
      setLogoClicks(0);
    }, 2000);
  };

  // Si no está conectado al backend, no mostrar nada
  if (!connected || !restauranteInfo) {
    return loading ? (
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Conectando al servidor...</div>
          </div>
        </div>
      </header>
    ) : null;
  }

  const nombrePartes = restauranteInfo.nombre.split(' ');
  const primerPalabra = nombrePartes[0] || "";
  const restoNombre = nombrePartes.slice(1).join(' ') || "";

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setShowMobileMenu(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 cursor-pointer select-none"
            onClick={handleLogoClick}
            title="Inicio"
          >
            <img 
              src={getImageUrl(restauranteInfo.logo_url)} 
              alt={`${restauranteInfo.nombre} Logo`}
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                <span className="text-green-600">{primerPalabra}</span>
              </h1>
              {restoNombre && (
                <p className="text-orange-500 text-sm sm:text-base font-medium -mt-1">
                  {restoNombre}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Desktop - Horizontal compacto */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-1 xl:space-x-2">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="px-4 xl:px-5 py-2 text-slate-800 hover:text-green-600 font-semibold text-base xl:text-lg transition-colors duration-200 rounded-lg hover:bg-green-50"
            >
              Inicio
            </button>
            
            <button 
              onClick={() => scrollToSection('menu')}
              className="px-4 xl:px-5 py-2 text-slate-800 hover:text-green-600 font-semibold text-base xl:text-lg transition-colors duration-200 rounded-lg hover:bg-green-50"
            >
              Menú
            </button>
            
            <button 
              onClick={() => scrollToSection('nosotros')}
              className="px-4 xl:px-5 py-2 text-slate-800 hover:text-green-600 font-semibold text-base xl:text-lg transition-colors duration-200 rounded-lg hover:bg-green-50"
            >
              Nosotros
            </button>
            
            <button 
              onClick={() => scrollToSection('ubicacion')}
              className="px-4 xl:px-5 py-2 text-slate-800 hover:text-green-600 font-semibold text-base xl:text-lg transition-colors duration-200 rounded-lg hover:bg-green-50"
            >
              Ubicación
            </button>
          </nav>

          {/* Action Buttons Desktop */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* Call Button */}
            <button 
              onClick={handleCall}
              className="flex items-center gap-2 px-4 xl:px-5 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg font-semibold text-sm xl:text-base transition-colors duration-200 border border-orange-200 hover:border-orange-300"
              title="Llamar ahora"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden xl:inline">{restauranteInfo.telefono}</span>
              <span className="inline xl:hidden">Llamar</span>
            </button>
            
            {/* WhatsApp Button */}
            <button 
              onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}?text=Hola, me gustaría hacer un pedido`, '_blank')}
              className="flex items-center gap-2 px-4 xl:px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm xl:text-base transition-colors duration-200"
              title="Contactar por WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span className="hidden xl:inline">WhatsApp</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-slate-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <button 
              onClick={() => { scrollToSection('inicio'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-slate-800 hover:bg-green-50 rounded-lg font-semibold transition-colors"
            >
              Inicio
            </button>
            
            <button 
              onClick={() => { scrollToSection('menu'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-slate-800 hover:bg-green-50 rounded-lg font-semibold transition-colors"
            >
              Menú
            </button>
            
            <button 
              onClick={() => { scrollToSection('nosotros'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-slate-800 hover:bg-green-50 rounded-lg font-semibold transition-colors"
            >
              Nosotros
            </button>
            
            <button 
              onClick={() => { scrollToSection('ubicacion'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-slate-800 hover:bg-green-50 rounded-lg font-semibold transition-colors"
            >
              Ubicación
            </button>
            
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <button 
                onClick={() => { handleCall(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{restauranteInfo.telefono}</span>
              </button>
              
              <button 
                onClick={() => { window.open(`https://wa.me/${restauranteInfo.whatsapp}?text=Hola, me gustaría hacer un pedido`, '_blank'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}