# Turing Box · Web

Página de presentación de **Turing Box**, grupo estudiantil de tecnología de la Universidad Nacional de Colombia, Sede Medellín, con tres nodos: **Horizons** (software), **IA** y **Videojuegos**.

## Qué incluye

- Intro animada: el logo de Turing Box se dibuja y se divide en los símbolos de los tres nodos. Se muestra una vez por sesión y se puede saltar.
- Landing guiada por el scroll: el escenario de nodos queda fijo mientras cambian Horizons, IA y Videojuegos.
- Interruptor de nodos en la cabecera. Aún no cambia la página: muestra un aviso de «próximamente».
- Sección del equipo con fotos (galería en escritorio, carrusel deslizable en móvil) y enlaces a Instagram (@turingbox_med).
- Diseño adaptable a móvil y escritorio. Respeta `prefers-reduced-motion`.

## Stack

HTML, CSS y JavaScript sin dependencias ni paso de compilación.

- Animaciones con CSS Scroll-Driven Animations (`animation-timeline`), como mejora progresiva dentro de `@supports`.
- Tokens de color del manual de identidad v1.1 como variables CSS. Cada nodo usa los mismos nombres de token con distintos valores (`[data-mode]`), listos para el cambio de nodo.

## Ejecutar en local

```sh
python3 -m http.server 8000
```

Luego abre <http://localhost:8000>.

## Estructura

```
index.html        Página única
css/styles.css    Tokens, layout y animaciones
js/main.js        Intro, nodo activo del escenario y aviso del interruptor
assets/brand/     Logos y símbolos (manual de identidad v1.1)
assets/equipo/    Fotos del equipo (WebP)
assets/fonts/     Sora, Inter y JetBrains Mono (SIL Open Font License)
```

## Licencias

- Las fuentes se distribuyen bajo SIL Open Font License 1.1.
- Los logos y símbolos de Turing Box pertenecen al equipo de Turing Box y no se licencian para otros usos.

## Créditos

Web desarrollada por Santiago Escobar.
