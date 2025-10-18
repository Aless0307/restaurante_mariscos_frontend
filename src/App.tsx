import React, { useState } from 'react';
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { MenuSection } from "./components/MenuSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { LocationSection } from "./components/LocationSection";
import { Footer } from "./components/Footer";
import { LoginAdmin } from "./components/admin/LoginAdmin";
import { AdminPanel } from "./components/admin/AdminPanel";
import { AdminPanelDebug } from "./components/admin/AdminPanelDebug";
import { TokenExpirationModal } from "./components/admin/TokenExpirationModal";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { 
    token, 
    isTokenExpired, 
    showExpirationModal, 
    handleLogin, 
    handleLogout, 
    handleContinueWithExpiredToken, 
    handleReturnToMain 
  } = useAuth();

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = (newToken: string) => {
    const success = handleLogin(newToken);
    if (success) {
      setShowAdminLogin(false);
    } else {
      // Token expirado, mostrar error
      alert('El token recibido está expirado. Por favor, inténtalo de nuevo.');
    }
  };

  const handleAdminLogout = () => {
    handleLogout();
  };

  const handleCancelLogin = () => {
    setShowAdminLogin(false);
  };

  const handleTokenExpirationContinue = () => {
    handleContinueWithExpiredToken();
    setShowAdminLogin(true);
  };

  const handleTokenExpirationReturn = () => {
    handleReturnToMain();
  };

  // Si hay token de admin válido, mostrar el panel de administración
  if (token && !isTokenExpired) {
    return (
      <>
        <AdminPanel token={token} onLogout={handleAdminLogout} />
        <TokenExpirationModal
          isOpen={showExpirationModal}
          onContinue={handleTokenExpirationContinue}
          onReturnToMain={handleTokenExpirationReturn}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onAdminClick={handleAdminClick} />
      <HeroSection />
      <MenuSection />
      <FeaturesSection />
      <TestimonialsSection />
      <AboutSection />
      <LocationSection />
      <Footer />
      
      {/* Modal de login admin */}
      {showAdminLogin && (
        <LoginAdmin 
          onLogin={handleAdminLoginSuccess} 
          onCancel={handleCancelLogin} 
        />
      )}

      {/* Modal de expiración de token */}
      <TokenExpirationModal
        isOpen={showExpirationModal}
        onContinue={handleTokenExpirationContinue}
        onReturnToMain={handleTokenExpirationReturn}
      />
    </div>
  );
}