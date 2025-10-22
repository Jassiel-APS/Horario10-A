# Horario-Utez

Proyecto base para la app "Horario UTEZ" — basado en la PWA original del repositorio.

Contenido:
- `index.html` - página principal
- `horario.html` - vista interactiva del horario del grupo 10°A-IDGS
- `horario.js` - lógica que genera la tabla desde datos embebidos
- `sw.js` y `register.js` - Service Worker básico y registro

Cómo probar localmente:

```powershell
# desde la carpeta Horario-Utez
npx http-server -c-1
# abrir http://localhost:8080/horario.html
```

Puedes tomar este proyecto como base y adaptar estilos, iconos o sincronización con servidor.