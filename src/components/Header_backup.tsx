import { Button } from "./ui/button";
import { Menu, Phone, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onAdminClick?: () => void;
}

interface RestauranteBasico {
  nombre: string;
  logo_url: string;
  whatsapp: string;
}

export function Header({ onAdminClick }: HeaderProps) {
  const [restauranteInfo, setRestauranteInfo] = useState<RestauranteBasico>({
    nombre: "Dario",
    logo_url: "/logo-cangrejo.png",
    whatsapp: "522291096048"
  });

  useEffect(() => {
    cargarInfoBasica();
  }, []);

  const cargarInfoBasica = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/restaurante/info-publica`);
      
      if (response.ok) {
        const data = await response.json();
        setRestauranteInfo({
          nombre: data.nombre || "Dario",
          logo_url: data.logo_url || "/logo-cangrejo.png",
          whatsapp: data.whatsapp || "522291096048"
        });
      }
    } catch (error) {
      console.error('❌ Error cargando información básica del restaurante:', error);
    }
  };

  const getImageUrl = (url: string): string => {
    if (!url) return '/logo-cangrejo.png';
    
    // Si la URL empieza con /api/ (GridFS) o es http/https, la usamos tal como está
    if (url.startsWith('/api/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es una ruta relativa que empieza con /, asumimos que está en public
    if (url.startsWith('/')) {
      return url;
    }
    
    // Si es solo el nombre del archivo, asumimos que está en public
    return `/${url}`;
  };

  const nombrePartes = restauranteInfo.nombre.split(' ');
  const primerPalabra = nombrePartes[0] || "Dario";
  const restoNombre = nombrePartes.slice(1).join(' ') || "Restaurante";

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={getImageUrl(restauranteInfo.logo_url)} 
              alt={`${restauranteInfo.nombre} Logo`}
              className="w-14 h-14 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-green-500">{primerPalabra}</span>
              </h1>
              <p className="text-orange-500 text-sm font-medium -mt-1">
                {restoNombre}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-green-500 transition-colors font-medium"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="text-gray-700 hover:text-green-500 transition-colors font-medium"
            >
              Menú
            </button>
            <button 
              onClick={() => scrollToSection('nosotros')}
              className="text-gray-700 hover:text-green-500 transition-colors font-medium"
            >
              Nosotros
            </button>
            <button 
              onClick={() => scrollToSection('ubicacion')}
              className="text-gray-700 hover:text-green-500 transition-colors font-medium"
            >
              Ubicación
            </button>
          </nav>

          {/* Contact Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span>+52 229 109 6048</span>
            </div>
            <Button 
              size="sm" 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => window.open(`https://wa.me/${restauranteInfo.whatsapp}`, '_blank')}
            >
              WhatsApp
            </Button>
            
            {/* Botón de Administrador */}
            <Button 
              onClick={onAdminClick}
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
              title="Panel de Administración"
            >
              <Settings className="w-4 h-4 mr-1" />
              Admin
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
            
            <Button variant="ghost">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}