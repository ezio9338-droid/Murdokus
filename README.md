# 🔍 Murdokus

Puzles de asesinato al estilo sudoku, con estética noir. Coloca a cada sospechoso (y a la víctima) en el plano de la casa: **una persona por fila y por columna**, y todas las declaraciones deben cumplirse. Quien se quedó **a solas con la víctima** es el asesino.

- **Caso del día**: el mismo para todo el mundo. Lunes y martes fácil, de miércoles a viernes medio, y el fin de semana difícil. Lleva la cuenta de tu racha.
- **Modo ilimitado**: casos nuevos sin límite en Fácil (5×5), Medio (6×6) o Difícil (7×7). Cada caso tiene un código (`?caso=ABCDE&d=medio`) que puedes compartir para retar a alguien con el mismo puzle.
- Cada caso se genera al momento y se comprueba que tenga **una única solución**.
- Pistas, deshacer, marcas ✕, cronómetro, historial y resultado para compartir.
- Adaptado a móvil e instalable como app (“Añadir a pantalla de inicio”). Funciona sin conexión.

## Publicarlo en GitHub Pages

1. Fusiona esta rama en `main` (o usa directamente esta rama).
2. En el repositorio, ve a **Settings → Pages**.
3. En *Build and deployment*, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
4. En un par de minutos estará disponible en `https://<tu-usuario>.github.io/<repositorio>/`.

No hace falta compilar nada: es HTML, CSS y JavaScript estático.

## Desarrollo

```bash
python3 -m http.server 8000      # y abre http://localhost:8000
node tools/verify.mjs 50         # comprueba que todos los casos generados tengan solución única
```

Estructura:

- `js/generator.js`: crea el plano, los muebles, la solución secreta y las pistas mínimas.
- `js/solver.js`: solucionador que garantiza que la solución sea única.
- `js/data.js`: habitaciones, muebles, personajes, lugares y armas (para añadir contenido).
- `js/app.js`: la interfaz del juego.

Inspirado en los *Murdoku* de Manuel Garand.
