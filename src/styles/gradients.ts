/**
 * Sistema de gradientes y estilos reutilizables
 * Define un único gradiente principal para todo el proyecto
 * Modularizado para fácil mantenimiento
 */

// Gradiente principal: De verde oscuro a verde claro (más profesional y cohesivo)
export const GRADIENTS = {
  // Gradiente principal: Verde profesional
  primary: 'from-green-600 to-green-400',
  primaryReverse: 'from-green-400 to-green-600',
  
  // Gradiente secundario: Naranja a ámbar (complementario)
  secondary: 'from-orange-500 to-amber-400',
  
  // Gradientes pastel para fondos
  primaryLight: 'from-green-100 to-green-50',
  secondaryLight: 'from-orange-100 to-amber-50',
  
  // Gradientes con transparencia
  primaryWithOpacity: 'from-green-500/20 to-green-400/10',
  secondaryWithOpacity: 'from-orange-500/20 to-amber-400/10',
};

// Clases de utilidad predefinidas
export const GRADIENT_CLASSES = {
  // Badge/Etiqueta principal
  badge: `bg-gradient-to-r ${GRADIENTS.primary} text-white`,
  badgeSecondary: `bg-gradient-to-r ${GRADIENTS.secondary} text-white`,
  
  // Títulos con gradiente
  titleGradient: `bg-gradient-to-r ${GRADIENTS.primary} bg-clip-text text-transparent`,
  titleGradientSecondary: `bg-gradient-to-r ${GRADIENTS.secondary} bg-clip-text text-transparent`,
  
  // Botones
  buttonPrimary: `bg-gradient-to-r ${GRADIENTS.primary} text-white hover:from-green-700 hover:to-green-500 transition-all duration-300`,
  buttonSecondary: `bg-gradient-to-r ${GRADIENTS.secondary} text-white hover:from-orange-600 hover:to-amber-500 transition-all duration-300`,
  
  // Fondos
  bgPrimaryLight: `bg-gradient-to-r ${GRADIENTS.primaryLight}`,
  bgSecondaryLight: `bg-gradient-to-r ${GRADIENTS.secondaryLight}`,
  
  // Decorativos
  decorativeDot: `w-2 h-2 bg-gradient-to-r ${GRADIENTS.primary} rounded-full`,
};

/**
 * Hook para obtener clases de gradiente con Tailwind
 * @param type - Tipo de gradiente a usar
 * @returns String de clases Tailwind
 */
export const getGradientClass = (
  type: 'primary' | 'secondary' | 'primaryLight' | 'secondaryLight' | 'primary-reverse'
): string => {
  const map: Record<string, string> = {
    primary: `bg-gradient-to-r ${GRADIENTS.primary}`,
    secondary: `bg-gradient-to-r ${GRADIENTS.secondary}`,
    primaryLight: `bg-gradient-to-r ${GRADIENTS.primaryLight}`,
    secondaryLight: `bg-gradient-to-r ${GRADIENTS.secondaryLight}`,
    'primary-reverse': `bg-gradient-to-r ${GRADIENTS.primaryReverse}`,
  };
  return map[type] || '';
};
