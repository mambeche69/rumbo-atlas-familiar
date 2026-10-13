# Rumbo — Atlas familiar

Rumbo es una aplicación web creada para el Hackathon de Vibe Coding del Máster en Inteligencia Artificial de BIG School. Reúne recuerdos familiares de viaje, los organiza por destino y permite convertir una selección en una cápsula compartible.

## Aplicación desplegada

https://rumbo-atlas-familiar.hearty-tang-0607.chatgpt.site

- Código de demostración: `VIAJE`
- Idiomas: español y francés
- Datos, nombres e imágenes: completamente ficticios

## Funcionalidades

- Atlas interactivo con destinos y recuerdos asociados.
- Bandeja demostrativa de aportaciones familiares.
- Búsqueda y filtros por viaje.
- Selección de recuerdos favoritos.
- Cápsulas compartibles mediante enlaces.
- Acceso de demostración y experiencia adaptada a móvil.

## Arquitectura

Aplicación web estática construida con HTML, CSS y JavaScript generados mediante Vibe Coding con Codex. Los favoritos y el estado de la demostración se conservan en el almacenamiento del navegador. Las cápsulas codifican su selección y dedicatoria en el enlace compartido.

## Estructura

- `dist/`: aplicación lista para desplegar.
- `dist/assets/`: imágenes ficticias de demostración.

## Ejecución local

Sirve la carpeta `dist` con cualquier servidor HTTP estático. Por ejemplo:

```bash
python3 -m http.server 4173 --directory dist
```

Después abre `http://localhost:4173`.

## Desarrollo

El proyecto fue desarrollado durante la ventana del hackatón mediante instrucciones en lenguaje natural e iteraciones conversacionales con Codex. El historial de prompts se entrega por separado según las bases de la competencia.
