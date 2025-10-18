import { Button } from "./ui/button";
import { Menu, Phone, Settings } from "lucide-react";
import { useState } from "react";
import { useRestauranteInfo, getImageUrl } from "../hooks/useRestauranteInfo";

interface HeaderProps {
  onAdminClick?: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const { restauranteInfo, loading, connected } = useRestauranteInfo();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo - Flex que se adapta */}
          <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
            <img 
              src={getImageUrl(restauranteInfo.logo_url)} 
              alt={`${restauranteInfo.nombre} Logo`}
              className="w-14 h-14 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-green-500">{primerPalabra}</span>
              </h1>
              {restoNombre && (
                <p className="text-orange-500 text-sm font-medium -mt-1">
                  {restoNombre}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Desktop - Flex que crece automáticamente */}
          <div className="hidden md:flex justify-center flex-1 max-w-4xl">
            <nav className="bg-gradient-to-r from-white/80 via-slate-50/70 to-white/80 backdrop-blur-md rounded-2xl px-6 lg:px-8 xl:px-12 py-3 lg:py-4 border-2 border-amber-200/40 shadow-xl ring-1 ring-amber-100/30">
              <div className="flex items-center space-x-5 lg:space-x-7 xl:space-x-9">
                <button 
                  onClick={() => scrollToSection('inicio')}
                  className="relative px-4 lg:px-6 xl:px-8 py-2 lg:py-3 text-slate-800 hover:text-amber-900 transition-all duration-400 font-semibold text-base lg:text-lg xl:text-xl hover:scale-105 group whitespace-nowrap"
                >
                  <span className="relative z-10 tracking-wide">Inicio</span>
                </button>
                
                <div className="w-0.5 h-6 lg:h-7 xl:h-8 bg-gradient-to-b from-amber-300 to-orange-300 rounded-full opacity-60"></div>
                
                <button 
                  onClick={() => scrollToSection('menu')}
                  className="relative px-4 lg:px-6 xl:px-8 py-2 lg:py-3 text-slate-800 hover:text-orange-900 transition-all duration-400 font-semibold text-base lg:text-lg xl:text-xl hover:scale-105 group whitespace-nowrap"
                >
                  <span className="relative z-10 tracking-wide">Menú</span>
                </button>
                
                <div className="w-0.5 h-6 lg:h-7 xl:h-8 bg-gradient-to-b from-orange-300 to-amber-300 rounded-full opacity-60"></div>
                
                <button 
                  onClick={() => scrollToSection('nosotros')}
                  className="relative px-4 lg:px-6 xl:px-8 py-2 lg:py-3 text-slate-800 hover:text-emerald-900 transition-all duration-400 font-semibold text-base lg:text-lg xl:text-xl hover:scale-105 group whitespace-nowrap"
                >
                  <span className="relative z-10 tracking-wide">Nosotros</span>
                </button>
                
                <div className="w-0.5 h-6 lg:h-7 xl:h-8 bg-gradient-to-b from-emerald-300 to-orange-300 rounded-full opacity-60"></div>
                
                <button 
                  onClick={() => scrollToSection('ubicacion')}
                  className="relative px-4 lg:px-6 xl:px-8 py-2 lg:py-3 text-slate-800 hover:text-amber-900 transition-all duration-400 font-semibold text-base lg:text-lg xl:text-xl hover:scale-105 group whitespace-nowrap"
                >
                  <span className="relative z-10 tracking-wide">Ubicación</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Contact Section - Flex que se adapta automáticamente */}
          <div className="hidden lg:flex items-center flex-shrink-0 space-x-3 lg:space-x-4 xl:space-x-6 2xl:space-x-8">
            {/* Teléfono que crece con la pantalla */}
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 bg-gradient-to-r from-amber-50 to-orange-50 px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 rounded-2xl border-2 border-amber-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="w-10 lg:w-12 xl:w-14 h-10 lg:h-12 xl:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                <Phone className="w-5 lg:w-6 xl:w-7 h-5 lg:h-6 xl:h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs lg:text-sm xl:text-base font-medium text-amber-700 uppercase tracking-wider">Llamanos</span>
                <span className="text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold text-slate-800 tracking-wide">{restauranteInfo.telefono} </span>
              </div>
            </div>
            
            {/* Botón WhatsApp que crece con la pantalla */}
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/30 hover:border-emerald-300/50"
              onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank')}
            >
              <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
                <div className="w-5 lg:w-7 xl:w-8 h-5 lg:h-7 xl:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm lg:text-base xl:text-lg">💬</span>
                </div>
                <span className="tracking-wide text-sm lg:text-base xl:text-lg">WhatsApp</span>
              </div>
            </Button>
            
            {/* Botón de Administrador que crece con la pantalla */}
            <Button 
              onClick={onAdminClick}
              variant="outline"
              size="sm"
              className="border-2 border-orange-400/60 text-orange-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white hover:border-orange-300 transition-all duration-300 font-semibold px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-r from-orange-50 to-amber-50"
              title="Panel de Administración"
            >
              <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
                <div className="w-5 lg:w-7 xl:w-8 h-5 lg:h-7 xl:h-8 bg-orange-100 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-300">
                  <Settings className="w-3 lg:w-5 xl:w-6 h-3 lg:h-5 xl:h-6" />
                </div>
                <span className="tracking-wide text-sm lg:text-base xl:text-lg">Admin</span>
              </div>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Botón Admin Mobile */}
            <Button 
              onClick={onAdminClick}
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Sin Subtarjetas */}
        {showMobileMenu && (
          <div className="md:hidden mt-6 py-8 border-t border-amber-200/60 bg-gradient-to-b from-amber-50/50 to-orange-50/30 rounded-b-3xl shadow-xl">
            <nav className="flex flex-col space-y-6 px-6">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-left px-6 py-4 text-slate-800 hover:text-amber-900 transition-all duration-400 font-bold text-lg hover:scale-[1.03] group"
              >
                <span className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mr-6 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                  <span className="tracking-wide">Inicio</span>
                </span>
              </button>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
              
              <button 
                onClick={() => scrollToSection('menu')}
                className="text-left px-6 py-4 text-slate-800 hover:text-orange-900 transition-all duration-400 font-bold text-lg hover:scale-[1.03] group"
              >
                <span className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mr-6 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                  <span className="tracking-wide">Menú</span>
                </span>
              </button>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              
              <button 
                onClick={() => scrollToSection('nosotros')}
                className="text-left px-6 py-4 text-slate-800 hover:text-emerald-900 transition-all duration-400 font-bold text-lg hover:scale-[1.03] group"
              >
                <span className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mr-6 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                  <span className="tracking-wide">Nosotros</span>
                </span>
              </button>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
              
              <button 
                onClick={() => scrollToSection('ubicacion')}
                className="text-left px-6 py-4 text-slate-800 hover:text-amber-900 transition-all duration-400 font-bold text-lg hover:scale-[1.03] group"
              >
                <span className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full mr-6 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                  <span className="tracking-wide">Ubicación</span>
                </span>
              </button>
              
              {/* Contact info mobile - Con Más Espacio */}
              <div className="pt-8 mt-8 border-t border-amber-200/60 space-y-6">
                <div className="flex items-center space-x-6 text-slate-800 px-8 py-6 bg-gradient-to-r from-amber-100/80 to-orange-100/60 rounded-3xl border-2 border-amber-200/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex flex-col py-1">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Llamanos Ahora</span>
                    <span className="font-bold text-lg tracking-wide">{restauranteInfo.telefono}</span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 w-full rounded-3xl py-6 font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border-2 border-emerald-400/30"
                  onClick={() => {
                    window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank');
                    setShowMobileMenu(false);
                  }}
                >
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-9 h-9 bg-white/20 rounded-3xl flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <span className="tracking-wide">Contactar por WhatsApp</span>
                    <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                  </div>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}