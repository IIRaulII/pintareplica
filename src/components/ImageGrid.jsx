import { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import Masonry from 'react-masonry-css';
import './ImageGrid.css';

const ImageGrid = ({ images, loading, error, lastImageElementRef }) => {
  const [columns, setColumns] = useState(0);
  
  // Función para calcular el número de columnas basado en el ancho de la ventana
  const calculateColumns = () => {
    const screenWidth = window.innerWidth;
    const maxCardWidth = 250; // Ancho máximo de cada tarjeta
    const gridGap = 16; // Espacio entre columnas (debe coincidir con --spacing-grid en CSS)
    
    // Calcular cuántas columnas caben en la pantalla
    const cols = Math.max(1, Math.floor(screenWidth / (maxCardWidth + gridGap)));
    
    // Asegurar que las columnas ocupen todo el ancho disponible
    return cols;
  };
  
  // Actualizar el número de columnas cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setColumns(calculateColumns());
    };
    
    // Calcular columnas iniciales
    handleResize();
    
    // Agregar event listener para resize
    window.addEventListener('resize', handleResize);
    
    // Limpiar event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Configuración de breakpoints para el layout responsive
  const breakpointColumnsObj = {
    default: columns || calculateColumns(), // Número de columnas basado en el ancho de la pantalla
    2000: 8,    // 8 columnas para pantallas de hasta 2000px
    1800: 7,    // 7 columnas para pantallas de hasta 1800px
    1500: 6,    // 6 columnas para pantallas de hasta 1500px
    1200: 5,    // 5 columnas para pantallas de hasta 1200px
    900: 4,     // 4 columnas para pantallas de hasta 900px
    700: 3,     // 3 columnas para pantallas de hasta 700px
    500: 2,     // 2 columnas para pantallas de hasta 500px
    400: 1      // 1 columna para pantallas de hasta 400px
  };

  if (loading && (!images || images.length === 0)) {
    return <div className="loading">Cargando imágenes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!images || images.length === 0) {
    return <div className="no-results">No se encontraron imágenes</div>;
  }

  // Eliminar posibles imágenes duplicadas y validar que cada imagen tenga los datos necesarios
  const uniqueImages = [];
  const seenIds = new Set();
  
  for (const image of images) {
    // Verificar que la imagen tiene un ID y la estructura necesaria
    if (image && image.id && !seenIds.has(image.id)) {
      // Verificar que la imagen tiene las propiedades necesarias
      if (image.urls && image.user) {
        seenIds.add(image.id);
        uniqueImages.push(image);
      }
    }
  }

  // Si después de filtrar no quedan imágenes válidas
  if (uniqueImages.length === 0) {
    return <div className="no-results">No se encontraron imágenes válidas</div>;
  }

  // Función para asignar la referencia al último elemento de manera segura
  const setLastImageRef = (node, isLast) => {
    if (isLast && lastImageElementRef && typeof lastImageElementRef === 'function') {
      // Asegurarse de que el nodo existe y es un elemento del DOM
      if (node && node.nodeType === 1) {
        lastImageElementRef(node);
      }
    }
  };

  return (
    <div className="grid-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {uniqueImages.map((image, index) => {
          // Asegurar que cada imagen tenga un ID único
          const uniqueKey = `${image.id}-${index}`;
          const isLastItem = index === uniqueImages.length - 1;
          
          return (
            <div 
              key={uniqueKey} 
              ref={node => setLastImageRef(node, isLastItem)}
              className={isLastItem ? 'last-image-item' : ''}
            >
              <ImageCard image={image} />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default ImageGrid;
