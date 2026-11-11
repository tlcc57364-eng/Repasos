# Repasos

Sitio estático de repaso tipo quiz para las materias del 10.º semestre.

- `index.html` — inicio con todas las materias.
- `sistemas-expertos.html` — repaso de Sistemas Expertos (25 preguntas del examen + práctica extra).
- `assets/data/<materia>.js` — bancos de preguntas.
- `assets/quiz.js` — motor del quiz (reutilizable para cualquier materia).

## Agregar una materia nueva
1. Copiar `assets/data/sistemas-expertos.js` como `assets/data/<materia>.js` y cambiar las preguntas
   (`answer` es el índice, desde 0, de la opción correcta).
2. Copiar `sistemas-expertos.html` como `<materia>.html` y apuntar el `<script>` al nuevo archivo de datos.
3. Activar la tarjeta correspondiente en `index.html`.

## Despliegue
Netlify: importar el repositorio, sin comando de build, directorio de publicación `.` (ya configurado en `netlify.toml`).
