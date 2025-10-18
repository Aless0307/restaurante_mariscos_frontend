# 🍽️ Restaurante Darío - Frontend

Aplicación web moderna del restaurante construida con React, TypeScript y Vite.

## 🚀 Despliegue en Producción

### **Frontend (Vercel/Netlify):**

1. **Vercel (Recomendado):**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Netlify:**
   - Conecta tu repositorio GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configurar variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend.railway.app
   ```

## 🛠️ Desarrollo Local

1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/restaurante-frontend.git
   cd restaurante-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con la URL de tu backend
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## 🎯 Características Implementadas

### 🔐 **Sistema de Autenticación**
- Login de administrador seguro
- Gestión automática de tokens JWT (1 hora)
- Modal de expiración de sesión
- Redirección automática al cerrar sesión

### 🛠️ **Panel de Administración**
- Dashboard con estadísticas
- Gestión completa del menú
- Editor de información del restaurante
- Gestión simplificada de imágenes
- Indicador de tiempo de sesión

### 📸 **Gestión de Imágenes**
- Subida de imágenes para categorías
- Vista previa en tiempo real
- Espacios predefinidos (no se pueden borrar)
- Interfaz limpia y funcional

### 🍽️ **Sitio Web Público**
- Página principal del restaurante
- Secciones: Hero, Acerca de, Menú, etc.
- Diseño responsive
- Optimizado para móviles

## 📁 Estructura del Proyecto

```
restaurante-frontend/
├── src/
│   ├── components/
│   │   ├── admin/           # Panel de administración
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── LoginAdmin.tsx
│   │   │   ├── SimpleImageManager.tsx
│   │   │   └── TokenExpirationModal.tsx
│   │   ├── ui/              # Componentes UI
│   │   └── ...              # Secciones del sitio
│   ├── hooks/
│   │   └── useAuth.ts       # Hook de autenticación
│   ├── services/
│   │   └── api.ts           # Configuración de API
│   └── App.tsx              # Componente principal
├── .env.example             # Template de variables
├── package.json             # Dependencias
├── vite.config.ts           # Configuración Vite
└── README.md
```

## 🔧 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool moderno
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **ShadCN/UI** - Componentes UI

## ✨ Funcionalidades del Admin

### 🏠 **Dashboard**
- Estadísticas en tiempo real
- Resumen de categorías e items
- Estado de activación
- Indicadores visuales

### 🍽️ **Gestión de Menú**
- CRUD completo de categorías
- CRUD completo de items
- Vista previa de imágenes
- Ordenamiento y filtros

### 🖼️ **Gestión de Imágenes**
- Espacios predefinidos para categorías
- Cambio de imágenes (no borrado)
- Preview en tiempo real
- Subida optimizada

### ⚙️ **Configuración**
- Editor de información del restaurante
- Gestión de contacto y horarios
- Configuración de características

## 🔒 Seguridad

- ✅ Rutas protegidas para admin
- ✅ Verificación automática de tokens
- ✅ Manejo de expiración de sesión
- ✅ Interceptor de errores 401
- ✅ Confirmación antes de cerrar sesión

## 🌐 Variables de Entorno

```env
# .env
VITE_API_URL=http://localhost:8000

# .env.production (Vercel/Netlify)
VITE_API_URL=https://tu-backend.railway.app
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)
- ✅ Touch-friendly buttons
- ✅ Optimized images

## 🧪 Testing

```bash
# Verificar que el frontend se conecte al backend
# 1. Asegúrate de que el backend esté corriendo
# 2. Inicia el frontend: npm run dev
# 3. Navega a: http://localhost:3000
# 4. Haz clic en "Admin" y prueba el login
```

## 📦 Build & Deploy

### **Build local:**
```bash
npm run build
# Los archivos se generan en dist/
```

### **Vercel:**
```bash
vercel --prod
# O conecta tu repositorio en vercel.com
```

### **Netlify:**
```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

## 🔧 Configuración para Producción

1. **Actualizar .env:**
   ```env
   VITE_API_URL=https://tu-backend-desplegado.com
   ```

2. **Verificar CORS en backend:**
   - Asegúrate de que tu dominio frontend esté en las URLs permitidas

3. **SSL/HTTPS:**
   - Vercel y Netlify proporcionan HTTPS automáticamente

## 📞 Soporte

- **Desarrollo**: http://localhost:3000
- **Admin Panel**: http://localhost:3000 → Click "Admin"
- **Build Output**: `dist/` folder

---

✨ **Frontend moderno y completamente funcional**