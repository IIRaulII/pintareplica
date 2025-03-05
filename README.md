# Réplica de Pinterest

Este proyecto es una réplica de Pinterest desarrollada con Vite y React. Permite a los usuarios buscar y visualizar imágenes utilizando la API de Unsplash.

## Características

- Búsqueda de imágenes por términos
- Visualización de imágenes en una cuadrícula similar a Pinterest
- Diseño responsive (adaptable a diferentes tamaños de pantalla)
- Muestra información del usuario que subió cada imagen
- Fallback a imágenes de gatos cuando no se encuentran resultados
- Posibilidad de volver al estado inicial haciendo clic en el logo

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- Una cuenta de desarrollador en Unsplash para obtener una API key

## Configuración

1. Clona este repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Obtén una API key de Unsplash registrándote en [Unsplash Developers](https://unsplash.com/developers)
4. Abre el archivo `.env` y reemplaza `TU_API_KEY_AQUI` con tu API key de Unsplash

## Ejecución

Para ejecutar el proyecto en modo desarrollo:

```
npm run dev
```

Para construir el proyecto para producción:

```
npm run build
```

Para previsualizar la versión de producción:

```
npm run preview
```

## Tecnologías utilizadas

- Vite
- React
- Axios (para peticiones HTTP)
- API de Unsplash

## Estructura del proyecto

- `src/components/`: Componentes React
  - `Header.jsx`: Contiene el logo y el buscador
  - `ImageCard.jsx`: Componente para mostrar cada imagen
  - `ImageGrid.jsx`: Cuadrícula para mostrar las imágenes
- `src/services/`: Servicios para manejar peticiones a la API
  - `unsplashService.js`: Funciones para interactuar con la API de Unsplash
- `src/assets/`: Recursos estáticos como imágenes y logos

## Notas adicionales

Este proyecto es una réplica con fines educativos. Todas las imágenes se obtienen a través de la API de Unsplash y pertenecen a sus respectivos autores.
