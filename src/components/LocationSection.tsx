import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { useRestauranteInfo } from "../hooks/useRestauranteInfo";

export function LocationSection() {
  const { restauranteInfo, loading, connected } = useRestauranteInfo();

  // Si no está conectado al backend, no mostrar nada
  if (!connected || !restauranteInfo) {
    return loading ? (
      <section id="ubicacion" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600">Cargando información de ubicación...</div>
        </div>
      </section>
    ) : null;
  }

  return (
    <section id="ubicacion" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-green-500">Nuestra</span>
            <span className="text-orange-500 ml-2">
              Ubicación
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visítanos en nuestro acogedor restaurante ubicado en
            el corazón de la ciudad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="relative">
            <Card className="overflow-hidden h-[400px] lg:h-[500px]">
              <CardContent className="p-0 h-full">
                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.8886!2d-96.1644!3d19.2065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c35afbf3b63a5d%3A0x5a4f7e0e1b8c9d3a!2sCarr.+Veracruz+-+Medell%C3%ADn%2C+Veracruz%2C+Ver.%2C+M%C3%A9xico!5e0!3m2!1ses!2smx!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Ubicación de ${restauranteInfo.nombre}`}
                  className="w-full h-full"
                />

                {/* Map Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-gray-800">
                      {restauranteInfo.nombre}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Address */}
            {restauranteInfo.direccion && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-green-600">
                    <MapPin className="w-6 h-6" />
                    <span>Dirección</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg">
                    {restauranteInfo.nombre}
                    <br />
                    {restauranteInfo.direccion}
                  </p>
                  <button
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/maps?q=${encodeURIComponent(restauranteInfo.nombre + ', ' + restauranteInfo.direccion)}`,
                        "_blank",
                      )
                    }
                    className="mt-3 text-orange-500 hover:text-orange-600 font-semibold"
                  >
                    Ver en Google Maps →
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Hours */}
            {restauranteInfo.horarios && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-orange-600">
                    <Clock className="w-6 h-6" />
                    <span>Horarios de Atención</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Todos los días:
                    </span>
                    <span className="font-semibold">
                      {restauranteInfo.horarios}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-green-600">
                  <Phone className="w-6 h-6" />
                  <span>Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {restauranteInfo.telefono && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">
                        {restauranteInfo.telefono}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Llamadas y reservas
                      </p>
                    </div>
                  </div>
                )}

                {restauranteInfo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-semibold">
                        {restauranteInfo.email}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Consultas generales
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  {restauranteInfo.whatsapp && (
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/${restauranteInfo.whatsapp}`,
                          "_blank",
                        )
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <span>💬</span>
                      <span>Contactar por WhatsApp</span>
                    </button>
                  )}

                  {restauranteInfo.telefono && (
                    <button
                      onClick={() =>
                        window.open(`tel:${restauranteInfo.telefono}`, "_blank")
                      }
                      className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Llamar para Reservar
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}