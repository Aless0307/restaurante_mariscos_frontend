
# 🦀 Restaurante Mariscos - Frontend

Frontend moderno para restaurante de mariscos construido con React, TypeScript, Vite y Tailwind CSS.

## ✨ Características

- 🎨 **Interfaz moderna y responsive**
- 🖥️ **Panel de administración completo**
- 📱 **Mobile-first design**
- 🎯 **TypeScript para mayor robustez**
- ⚡ **Vite para desarrollo rápido**
- 🎨 **Tailwind CSS para estilos**

## 🚀 Despliegue en Vercel (Recomendado)

### Opción 1: Despliegue Automático (Recomendado)

1. **Ir a [Vercel](https://vercel.com)**
2. **Conectar con GitHub** y autorizar
3. **Importar proyecto** desde: `https://github.com/Aless0307/restaurante_mariscos_frontend`
4. **Configurar variables de entorno**:
   - `VITE_API_URL` = URL de tu backend (ej: `https://tu-backend.railway.app`)
5. **Deploy** automático

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# En el directorio del proyecto
vercel

# Seguir las instrucciones
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tu configuración
# VITE_API_URL=http://localhost:8000

# Iniciar desarrollo
npm run dev
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
npm run lint         # Linter
```

## 🌐 Variables de Entorno

```bash
VITE_API_URL=https://tu-backend-url.com
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/        # Componentes React
├── hooks/            # Custom hooks
├── services/         # Servicios API
├── styles/           # Estilos globales
└── main.tsx         # Punto de entrada
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License
  