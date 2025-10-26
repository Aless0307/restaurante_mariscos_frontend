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
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
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
              onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank')}
              className="flex items-center gap-2 px-4 xl:px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm xl:text-base transition-colors duration-200"
              title="Contactar por WhatsApp"
            >
              <span>💬</span>
              <span className="hidden xl:inline">WhatsApp</span>
            </button>
            
            {/* Admin Button */}
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-2 px-4 xl:px-5 py-3 border-2 border-orange-400 text-orange-600 hover:bg-orange-600 hover:text-white rounded-lg font-semibold text-sm xl:text-base transition-all duration-200"
              title="Panel de Administración"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden xl:inline">Admin</span>
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
                onClick={() => { window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>
              
              <button 
                onClick={() => { onAdminClick?.(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 border-2 border-orange-400 text-orange-600 hover:bg-orange-50 rounded-lg font-semibold transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Administración</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}