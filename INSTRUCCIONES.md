# 📚 INSTRUCCIONES - Cómo ejecutar el proyecto

Sigue estos pasos para ejecutar tu proyecto de InmoApp en Visual Studio Code.

## ✅ Paso 1: Preparar los archivos

1. **Descarga todos los archivos** de este proyecto
2. **Crea una carpeta llamada `mi-inmobiliaria`** en tu escritorio o donde prefieras
3. **Copia todos los archivos** en esa carpeta manteniendo la estructura:
   ```
   mi-inmobiliaria/
   ├── src/
   │   ├── components/
   │   │   └── SidebarInmobiliario.jsx
   │   ├── App.jsx
   │   ├── main.jsx
   │   └── index.css
   ├── index.html
   ├── vite.config.js
   ├── vercel.json
   ├── package.json
   ├── tailwind.config.js
   ├── postcss.config.js
   ├── .gitignore
   └── README.md
   ```

## 🚀 Paso 2: Abre VS Code

1. Abre **Visual Studio Code**
2. Ve a **File → Open Folder**
3. Selecciona la carpeta `mi-inmobiliaria`
4. Click en **Seleccionar Carpeta**

## 📦 Paso 3: Instala las dependencias

1. Abre la terminal en VS Code: `Ctrl + ñ` (o `Ctrl + ~`)
2. Escribe:
   ```bash
   npm install
   ```
3. **Espera a que termine** (tarda 1-2 minutos)
4. Verás mensajes como `added XXX packages`

## ▶️ Paso 4: Ejecuta el proyecto

En la terminal (en la misma carpeta), escribe:

```bash
npm run dev
```

Verás algo como:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 🌐 Paso 5: Abre en tu navegador

1. **Copia la URL:** `http://localhost:5173`
2. **Abre tu navegador** (Chrome, Firefox, Edge, etc.)
3. **Pega la URL** en la barra de direcciones
4. ¡**Presiona Enter**!

### ✨ ¡Listo! Deberías ver tu aplicación con el sidebar funcionando perfectamente.

---

## 🛑 Si algo falla...

### ❌ Error: "npm: command not found"
- **Solución:** Reinstala Node.js desde [nodejs.org](https://nodejs.org)
- Marca "Add to PATH" durante la instalación
- Reinicia VS Code y tu computadora

### ❌ Error: "node_modules: permission denied"
```bash
rm -r node_modules
npm install
```

### ❌ Puerto 5173 ya está en uso
```bash
npm run dev -- --port 3000
```
Luego abre `http://localhost:3000`

### ❌ La página no carga
- Verifica que escribiste la URL correctamente
- Asegúrate que `npm run dev` está ejecutándose en la terminal
- Presiona `Ctrl + Shift + R` para recargar (cache)

---

## 🎨 Para personalizar la aplicación

### Cambiar el nombre
1. Abre `src/components/SidebarInmobiliario.jsx`
2. Busca: `<span className="font-bold text-gray-900 text-lg">InmoApp</span>`
3. Cambia `InmoApp` por tu nombre

### Cambiar colores
1. Abre `src/components/SidebarInmobiliario.jsx`
2. En `menuItems`, cambia los valores `color: '#xxxxxx'`
3. Ejemplo: `color: '#ff0000'` para rojo

### Agregar opciones al menú
1. Abre `src/components/SidebarInmobiliario.jsx`
2. En `menuItems`, añade:
   ```jsx
   { id: 'nueva', label: 'Mi Opción', icon: Home, color: '#2563eb' }
   ```

---

## 📤 Desplegar en Vercel (Online)

### Opción A: Con GitHub (Recomendado)

1. **Crea una cuenta en GitHub** (gratis): [github.com](https://github.com)

2. **Sube tu proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Mi proyecto InMobiSuite"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/mi-inmobiliaria.git
   git push -u origin main
   ```

3. **Ve a Vercel**: [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Conecta con tu cuenta de GitHub
   - Selecciona tu repositorio
   - Click en "Deploy"
   - **¡Tu aplicación está online!**

### Opción B: Despliegue directo

1. Compila el proyecto:
   ```bash
   npm run build
   ```

2. Ve a [vercel.com/new](https://vercel.com/new)

3. Arrastra la carpeta `dist/` que se creó

4. ¡Listo! Tu aplicación tiene una URL pública

---

## 📝 Comandos útiles

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build |
| `npm install` | Instala las dependencias |
| `npm update` | Actualiza las dependencias |

---

## 💡 Tips

- **Guarda tus cambios** con `Ctrl + S`
- La aplicación **se recarga automáticamente** cuando cambias código
- Abre **DevTools** con `F12` para depuración
- Si algo no funciona, **abre la consola** (F12) para ver errores

---

## 📞 ¿Necesitas ayuda?

- Lee el archivo **README.md** para más detalles
- Verifica que `npm --version` funciona en tu terminal
- Asegúrate que Node.js está instalado: `node --version`

**¡Felicidades, ya tienes tu plataforma inmobiliaria funcionando! 🎉**
