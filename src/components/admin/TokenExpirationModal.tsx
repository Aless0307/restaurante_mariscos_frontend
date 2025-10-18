import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface TokenExpirationModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onReturnToMain: () => void;
}

export function TokenExpirationModal({ isOpen, onContinue, onReturnToMain }: TokenExpirationModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">⏰</span>
            <span>Sesión Expirada</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <p>Tu sesión de administrador ha expirado por seguridad.</p>
            <p className="text-sm text-gray-600">
              Las sesiones duran 1 hora desde el último login.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onReturnToMain}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            🏠 Ir a Página Principal
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onContinue}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            🔑 Iniciar Sesión Nuevamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}