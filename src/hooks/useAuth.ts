import { useState, useEffect, useCallback } from 'react';

interface DecodedToken {
  exp: number;
  sub: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [showExpirationModal, setShowExpirationModal] = useState(false);

  // Función para decodificar JWT sin verificar (solo para obtener exp)
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  };

  // Verificar si el token está expirado
  const checkTokenExpiration = useCallback((tokenToCheck: string): boolean => {
    const decoded = decodeToken(tokenToCheck);
    if (!decoded) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;
    
    if (isExpired) {
      console.log('🔴 Token expirado:', new Date(decoded.exp * 1000));
    } else {
      const timeLeft = decoded.exp - currentTime;
      console.log('🟢 Token válido. Expira en:', Math.floor(timeLeft / 60), 'minutos');
    }
    
    return isExpired;
  }, []);

  // Cargar token desde localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      if (checkTokenExpiration(savedToken)) {
        // Token expirado, mostrar modal
        setIsTokenExpired(true);
        setShowExpirationModal(true);
        localStorage.removeItem('adminToken');
      } else {
        setToken(savedToken);
      }
    }
  }, [checkTokenExpiration]);

  // Verificar expiración cada minuto
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (checkTokenExpiration(token)) {
        setIsTokenExpired(true);
        setShowExpirationModal(true);
        handleLogout();
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [token, checkTokenExpiration]);

  const handleLogin = (newToken: string) => {
    if (checkTokenExpiration(newToken)) {
      console.error('🔴 Intento de login con token expirado');
      return false;
    }
    
    console.log('🔍 DEBUG: Login exitoso, guardando token:', newToken.substring(0, 20) + '...');
    setToken(newToken);
    localStorage.setItem('adminToken', newToken);
    setIsTokenExpired(false);
    setShowExpirationModal(false);
    console.log('🔍 DEBUG: Token guardado en localStorage');
    return true;
  };

  const handleLogout = () => {
    setToken(null);
    setIsTokenExpired(false);
    setShowExpirationModal(false);
    localStorage.removeItem('adminToken');
    console.log('🔴 Sesión cerrada');
  };

  const handleContinueWithExpiredToken = () => {
    setShowExpirationModal(false);
    // Opcional: redirigir a login
  };

  const handleReturnToMain = () => {
    setShowExpirationModal(false);
    setIsTokenExpired(false);
  };

  return {
    token,
    isTokenExpired,
    showExpirationModal,
    handleLogin,
    handleLogout,
    handleContinueWithExpiredToken,
    handleReturnToMain,
    checkTokenExpiration
  };
};