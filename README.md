# Turing Box · Web

Página de presentación de **Turing Box**, semillero de tecnología de la Universidad Nacional de Colombia, Sede Medellín, con tres modos: **Horizons** (software), **IA** y **Videojuegos**.

## Qué incluye

- Intro animada: el logo de Turing Box se dibuja y se divide en los símbolos de los tres modos. Se muestra una vez por sesión y se puede saltar.
- Landing guiada por el scroll: el escenario de modos queda fijo mientras cambian Horizons, IA y Videojuegos.
- Interruptor de modos en la cabecera. Aún no cambia la página: muestra un aviso de «próximamente».
- Diseño adaptable a móvil y escritorio. Respeta `prefers-reduced-motion`.

## Stack

HTML, CSS y JavaScript sin dependencias ni paso de compilación.

- Animaciones con CSS Scroll-Driven Animations (`animation-timeline`), como mejora progresiva dentro de `@supports`.
- Tokens de color del manual de identidad v1.1 como variables CSS. Cada modo usa los mismos nombres de token con distintos valores (`[data-mode]`), listos para el cambio de modo.

## Ejecutar en local

```sh
python3 -m http.server 8000
```

Luego abre <http://localhost:8000>.

## Estructura

```
index.html        Página única
css/styles.css    Tokens, layout y animaciones
js/main.js        Intro, modo activo del escenario y aviso del interruptor
assets/brand/     Logos y símbolos (manual de identidad v1.1)
assets/fonts/     Sora, Inter y JetBrains Mono (SIL Open Font License)
```

## Licencias

- Las fuentes se distribuyen bajo SIL Open Font License 1.1.
- Los logos y símbolos de Turing Box pertenecen al equipo de Turing Box y no se licencian para otros usos.
