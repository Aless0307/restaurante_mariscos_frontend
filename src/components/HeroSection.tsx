import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRestauranteInfo, getImageUrl } from "../hooks/useRestauranteInfo";

export function HeroSection() {
  const { restauranteInfo, loading, connected } = useRestauranteInfo();

  // Si no está conectado al backend, no mostrar nada
  if (!connected || !restauranteInfo) {
    return loading ? (
      <section id="inicio" className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando al servidor...</p>
        </div>
      </section>
    ) : (
      <section id="inicio" className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">No se pudo conectar al servidor</p>
        </div>
      </section>
    );
  }

  // Extraer nombre y apellido para el título
  const nombreParts = restauranteInfo.nombre.split(' ');
  const primerNombre = nombreParts[0] || "";
  const resto = nombreParts.slice(1).join(' ') || "";

  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={getImageUrl(restauranteInfo.imagen_banner_url)}
          alt={`Deliciosos mariscos de ${restauranteInfo.nombre}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 flex items-center justify-center">
            <img 
              src={getImageUrl(restauranteInfo.logo_url)} 
              alt={`${restauranteInfo.nombre} Logo`}
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold mb-6">
          <span className="text-green-400">{primerNombre}</span>
          {resto && (
            <span className="text-orange-400 ml-4">
              {resto}
            </span>
          )}
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {restauranteInfo.descripcion_corta}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Menú
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white bg-white/10 text-white hover:bg-white hover:text-black px-8 py-3 text-lg backdrop-blur-sm"
            onClick={() =>
              window.open(
                `https://wa.me/${restauranteInfo.whatsapp}`,
                "_blank",
              )
            }
          >
            Reservar Mesa
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}