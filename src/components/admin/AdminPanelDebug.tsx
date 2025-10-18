import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChefHat, Clock, LogOut } from 'lucide-react';

interface Usuario {
  username: string;
  email: string;
}

interface AdminPanelDebugProps {
  token: string;
  onLogout: () => void;
}

export function AdminPanelDebug({ token, onLogout }: AdminPanelDebugProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newMessage = `[${timestamp}] ${message}`;
    console.log('🐛', newMessage);
    setDebugInfo(prev => [...prev, newMessage]);
  };

  const apiHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const testConnections = async () => {
    setLoading(true);
    setError(null);
    addDebugInfo('🚀 Iniciando tests de conexión...');
    
    try {
      // Test 1: Basic connection
      addDebugInfo('🔌 Test 1: Conexión básica al backend');
      const basicResponse = await fetch('http://localhost:8000/');
      addDebugInfo(`✅ Conexión básica: ${basicResponse.status} - ${basicResponse.statusText}`);
      
      // Test 2: Token validation
      addDebugInfo('🔑 Test 2: Validación de token');
      addDebugInfo(`Token presente: ${token ? 'SÍ' : 'NO'}`);
      addDebugInfo(`Token length: ${token?.length || 0}`);
      addDebugInfo(`Token sample: ${token?.substring(0, 50)}...`);
      
      // Test 3: Profile endpoint
      addDebugInfo('👤 Test 3: Endpoint de perfil');
      const profileUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth-mongo/profile`;
      addDebugInfo(`URL: ${profileUrl}`);
      
      const profileResponse = await fetch(profileUrl, {
        headers: apiHeaders,
      });
      
      addDebugInfo(`Respuesta perfil: ${profileResponse.status} - ${profileResponse.statusText}`);
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        addDebugInfo(`✅ Perfil obtenido: ${JSON.stringify(profileData)}`);
        setUsuario(profileData);
      } else {
        const errorText = await profileResponse.text();
        addDebugInfo(`❌ Error perfil: ${errorText}`);
        setError(`Error cargando perfil: ${profileResponse.status}`);
      }
      
      // Test 4: Categories endpoint
      addDebugInfo('📂 Test 4: Endpoint de categorías');
      const categoriesUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/categorias`;
      addDebugInfo(`URL: ${categoriesUrl}`);
      
      const categoriesResponse = await fetch(categoriesUrl, {
        headers: apiHeaders,
      });
      
      addDebugInfo(`Respuesta categorías: ${categoriesResponse.status} - ${categoriesResponse.statusText}`);
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        addDebugInfo(`✅ Categorías obtenidas: ${categoriesData.length} categorías`);
        setCategorias(categoriesData);
      } else {
        const errorText = await categoriesResponse.text();
        addDebugInfo(`❌ Error categorías: ${errorText}`);
        setError(`Error cargando categorías: ${categoriesResponse.status}`);
      }
      
      addDebugInfo('🎉 Tests completados');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      addDebugInfo(`💥 Error crítico: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    addDebugInfo('🔄 AdminPanelDebug montado, iniciando tests...');
    testConnections();
  }, []);

  const clearDebug = () => {
    setDebugInfo([]);
  };

  const downloadDebugLog = () => {
    const logContent = debugInfo.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-panel-debug-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Ejecutando diagnóstico...</h2>
            <p className="text-gray-600">Verificando conexiones y endpoints</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Log de Debug en Tiempo Real</h3>
            <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-green-400 text-sm font-mono mb-1">
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración - Debug</h1>
            <div className="flex gap-3">
              <button
                onClick={testConnections}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Volver a Probar
              </button>
              <button
                onClick={clearDebug}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Limpiar Log
              </button>
              <button
                onClick={downloadDebugLog}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Descargar Log
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <strong>Error detectado:</strong>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado del Usuario */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Estado del Usuario</h3>
              {usuario ? (
                <div className="space-y-2">
                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>Username:</strong> {usuario.username}</p>
                  <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    ✅ Usuario cargado correctamente
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                  ❌ Usuario no cargado
                </div>
              )}
            </div>

            {/* Estado de las Categorías */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Estado de las Categorías</h3>
              {categorias.length > 0 ? (
                <div className="space-y-2">
                  <p><strong>Total:</strong> {categorias.length} categorías</p>
                  <div className="max-h-32 overflow-y-auto">
                    {categorias.slice(0, 5).map((cat, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {cat.nombre} ({cat.items?.length || 0} items)
                      </div>
                    ))}
                    {categorias.length > 5 && (
                      <div className="text-sm text-gray-500">
                        ... y {categorias.length - 5} más
                      </div>
                    )}
                  </div>
                  <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    ✅ Categorías cargadas correctamente
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                  ❌ Categorías no cargadas
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Log de Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Log de Debug Completo</h3>
          <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-green-400 text-sm font-mono mb-1">
                {info}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}