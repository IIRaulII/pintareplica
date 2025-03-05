import { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss';
import Header from './components/Header';
import ImageGrid from './components/ImageGrid';
import { searchImages, getRandomImages, getCatImages, getMoreImages } from './services/unsplashService';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchFailed, setSearchFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  
  // Referencia al observador de intersección
  const observer = useRef(null);
  
  // Referencia al último elemento de la lista
  const lastImageElementRef = useCallback(node => {
    // Si no hay nodo, o estamos cargando, no hacer nada
    if (!node || loading || loadingMore) return;
    
    // Desconectar el observador anterior si existe
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }
    
    // Crear un nuevo observador solo si hay más contenido para cargar
    if (hasMore) {
      try {
        observer.current = new IntersectionObserver(entries => {
          // Verificar que el elemento aún existe en el DOM
          if (entries && entries.length > 0 && entries[0].isIntersecting && hasMore) {
            loadMoreImages();
          }
        }, { threshold: 0.5, rootMargin: '100px' });
        
        // Verificar que el nodo existe antes de observarlo
        if (node && node.nodeType === 1) {
          observer.current.observe(node);
        }
      } catch (error) {
        console.error('Error al crear o usar el IntersectionObserver:', error);
      }
    }
  }, [loading, loadingMore, hasMore]);

  // Limpiar el observador cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, []);

  // Cargar imágenes aleatorias al inicio
  useEffect(() => {
    loadInitialImages();
    
    // Limpiar el observador cuando cambia la búsqueda
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, []);

  const loadInitialImages = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchFailed(false);
      setCurrentSearchTerm('');
      setPage(1);
      setHasMore(true);
      const data = await getRandomImages();
      
      // Verificar que data es un array (puede ser un array vacío si hay error)
      if (Array.isArray(data)) {
        setImages(data);
      } else {
        // Si no es un array, intentar con imágenes de gatos
        loadCatImages();
      }
    } catch (error) {
      console.error('Error al cargar imágenes iniciales:', error);
      setError('Error al cargar imágenes. Por favor, intenta de nuevo más tarde.');
      // Intentar cargar imágenes de gatos como fallback
      loadCatImages();
    } finally {
      setLoading(false);
    }
  };

  const loadCatImages = async () => {
    try {
      setLoading(true);
      setCurrentSearchTerm('cats');
      setPage(1);
      const data = await getCatImages();
      
      // Verificar que data tiene la estructura esperada
      if (data && data.results) {
        setImages(data.results);
        setSearchFailed(true);
        setHasMore(data.total_pages > 1);
      } else {
        setImages([]);
        setHasMore(false);
        setError('No se pudieron cargar imágenes. Por favor, intenta de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error al cargar imágenes de gatos:', error);
      setError('Error al cargar imágenes. Por favor, intenta de nuevo más tarde.');
      setHasMore(false);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      setSearchFailed(false);
      setCurrentSearchTerm(searchTerm);
      setPage(1);
      const data = await searchImages(searchTerm);
      
      // Verificar que data tiene la estructura esperada
      if (data && data.results) {
        if (data.results.length === 0) {
          // Si no hay resultados, mostrar imágenes de gatos y mensaje
          setSearchFailed(true);
          setCurrentSearchTerm('cats');
          const catData = await getCatImages();
          
          if (catData && catData.results) {
            setImages(catData.results);
            setHasMore(catData.total_pages > 1);
          } else {
            setImages([]);
            setHasMore(false);
          }
        } else {
          setImages(data.results);
          setHasMore(data.total_pages > 1);
        }
      } else {
        // Si data no tiene la estructura esperada, cargar imágenes de gatos
        loadCatImages();
      }
    } catch (error) {
      console.error('Error al buscar imágenes:', error);
      setError('Error al buscar imágenes. Por favor, intenta de nuevo más tarde.');
      // Intentar cargar imágenes de gatos como fallback
      loadCatImages();
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      let newImages = [];
      if (currentSearchTerm) {
        // Si hay un término de búsqueda activo
        const data = await searchImages(currentSearchTerm, nextPage);
        if (data && data.results) {
          newImages = data.results;
          setHasMore(data.total_pages > nextPage);
        } else {
          setHasMore(false);
        }
      } else {
        // Si estamos en la vista inicial (imágenes aleatorias)
        const data = await getMoreImages(nextPage);
        if (Array.isArray(data)) {
          newImages = data;
        } else {
          setHasMore(false);
        }
      }
      
      // Asegurarnos de que no hay imágenes duplicadas por ID
      if (newImages.length > 0) {
        const existingIds = new Set(images.map(img => img.id));
        const uniqueNewImages = newImages.filter(img => !existingIds.has(img.id));
        
        setImages(prevImages => [...prevImages, ...uniqueNewImages]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error al cargar más imágenes:', error);
      setError('Error al cargar más imágenes. Por favor, intenta de nuevo más tarde.');
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="app">
      <Header onSearch={handleSearch} resetToInitial={loadInitialImages} />
      
      {searchFailed && (
        <div className="search-failed-message">
          No se encontraron imágenes con esa búsqueda. Mostrando imágenes de gatos.
          <p>Intenta con otra palabra o frase para una búsqueda correcta.</p>
        </div>
      )}
      
      <ImageGrid 
        images={images} 
        loading={loading} 
        error={error} 
        lastImageElementRef={lastImageElementRef}
      />
      
      {loadingMore && <div className="loading-more">Cargando más imágenes...</div>}
      
      {!hasMore && images.length > 0 && (
        <div className="no-more-images">No hay más imágenes para mostrar</div>
      )}
    </div>
  );
}

export default App;
