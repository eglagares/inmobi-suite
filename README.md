# InMobiSuite - Plataforma Inmobiliaria

Una aplicación web moderna y profesional para gestión inmobiliaria construida con React y Vite.

## 🚀 Características

- **Dashboard intuitivo** - Acceso rápido a todas las funciones
- **Buscar propiedades** - Búsqueda avanzada con filtros
- **Favoritos** - Guarda propiedades de interés
- **Gestión de propiedades** - Administra tus anuncios
- **Mensajería** - Comunícate con clientes
- **Reportes** - Analiza estadísticas
- **Sidebar colapsable** - Interface responsiva
- **Diseño moderno** - Interfaz profesional y atractiva

## 📋 Requisitos

- Node.js v20+ 
- npm o yarn

## 🛠️ Instalación Local

### 1. Clonar o descargar el proyecto

```bash
# Si tienes git
git clone <tu-repo-url>
cd InMobiSuite

# O simplemente descomprime los archivos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### 4. Compilar para producción

```bash
npm run build
```

Esto crea la carpeta `dist/` lista para despliegue.

### 5. Previsualizar build

```bash
npm run preview
```

## 🌐 Despliegue en Vercel

### Opción 1: Despliegue automático con Git

1. **Sube tu proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/InMobiSuite.git
   git branch -M main
   git push -u origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz login con GitHub
   - Click en "New Project"
   - Selecciona tu repositorio
   - Click en "Deploy"
   - ¡Listo! Vercel detectará automáticamente que es un proyecto Vite

### Opción 2: Despliegue manual

1. **Instala Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Autentica**
   ```bash
   vercel login
   ```

3. **Despliega**
   ```bash
   vercel
   ```

4. Sigue las instrucciones en pantalla

### Opción 3: Despliegue desde una carpeta dist

1. **Compila el proyecto**
   ```bash
   npm run build
   ```

2. **Sube la carpeta `dist/` a Vercel**
   - Ve a [vercel.com](https://vercel.com/new)
   - Arrastra la carpeta `dist/`
   - ¡Listo! Tu aplicación está en línea

## 📁 Estructura del Proyecto

```
InMobiSuite/
├── src/
│   ├── components/
│   │   └── SidebarInmobiliario.jsx  # Componente principal
│   ├── App.jsx                      # Componente raíz
│   ├── main.jsx                     # Punto de entrada
│   └── index.css                    # Estilos globales
├── index.html                       # HTML principal
├── vite.config.js                   # Configuración Vite
├── vercel.json                      # Configuración Vercel
├── package.json                     # Dependencias
├── .gitignore                       # Archivos ignorados en Git
└── README.md                        # Este archivo
```

## 📦 Dependencias

- **react** (^18.3.1) - Librería UI
- **react-dom** (^18.3.1) - Renderización en DOM
- **lucide-react** (^0.383.0) - Iconos profesionales
- **vite** (^5.0.8) - Bundler y dev server
- **@vitejs/plugin-react** - Plugin para React en Vite

## 🎨 Personalización

### Cambiar colores

Edita `src/components/SidebarInmobiliario.jsx` en la sección `menuItems`:

```jsx
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, color: '#2563eb' }, // Cambia este color
  // ...
];
```

### Cambiar nombre de la aplicación

Edita en `src/components/SidebarInmobiliario.jsx`:

```jsx
<span className="font-bold text-gray-900 text-lg">InMobiSuite</span>  // Cambia aquí
```

Y también en `index.html`:

```html
<title>InMobi Suite - Tu plataforma inmobiliaria</title>  <!-- Cambia aquí -->
```

### Agregar más opciones al menú

Edita `src/components/SidebarInmobiliario.jsx` y agrega a `menuItems`:

```jsx
{ id: 'nueva-opcion', label: 'Nueva Opción', icon: IconName, color: '#color' }
```

## 🚨 Problemas comunes

### Error: "node not found"
- Reinstala Node.js desde [nodejs.org](https://nodejs.org)
- Reinicia tu computadora

### Error: "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### Puerto 5173 en uso
```bash
npm run dev -- --port 3000
```

### Build falla en Vercel
- Asegúrate que `package.json` está en la raíz
- Verifica que `npm install` instala todas las dependencias
- Revisa los logs en el dashboard de Vercel

## 📝 Variables de entorno

Si necesitas agregar variables:

1. Crea `.env.local` en la raíz:
```
VITE_API_URL=https://tu-api.com
```

2. Accede en tu código:
```jsx
const apiUrl = import.meta.env.VITE_API_URL
```

3. En Vercel, ve a Settings → Environment Variables y añade la variable

## 🔐 Seguridad

- Nunca compartas archivos `.env` en Git (ya está en `.gitignore`)
- Las variables `VITE_*` se incluyen en el build (úsalas solo para datos públicos)
- Para datos sensibles, usa variables sin prefijo `VITE_` en el servidor

## 📞 Soporte

Para reportar bugs o sugerencias, abre un issue en tu repositorio.

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT.

---

**Hecho con ❤️ usando React + Vite**
