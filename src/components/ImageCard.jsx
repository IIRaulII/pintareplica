import { useState, useEffect } from 'react';
import './ImageCard.css';

const ImageCard = ({ image }) => {
  const [showVisitButton, setShowVisitButton] = useState(false);
  const [avatarBorderColor, setAvatarBorderColor] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Generar un color aleatorio para el borde del avatar al cargar el componente
  useEffect(() => {
    setAvatarBorderColor(getRandomColor());
  }, []);
  
  // Formatear la fecha en formato DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Fecha inválida
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };

  // Generar un color aleatorio para el avatar
  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF5', '#F533FF', '#FF8C33', '#33FFB8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Obtener las iniciales del nombre del usuario
  const getUserInitials = (name) => {
    if (!name) return '';
    try {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    } catch (error) {
      console.error('Error al obtener iniciales:', error);
      return '';
    }
  };

  // Manejar error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };

  // Verificar que la imagen tiene todas las propiedades necesarias
  if (!image || !image.urls || !image.user) {
    return <div className="image-card-error">Error al cargar la imagen</div>;
  }

  return (
    <div 
      className="image-card"
      onMouseEnter={() => setShowVisitButton(true)}
      onMouseLeave={() => setShowVisitButton(false)}
    >
      <div className="image-container">
        {!imageError ? (
          <img 
            src={image.urls.regular} 
            alt={image.alt_description || 'Imagen de Unsplash'} 
            className="card-image"
            onError={handleImageError}
          />
        ) : (
          <div className="image-error">
            <span>Error al cargar la imagen</span>
          </div>
        )}
        {showVisitButton && image.links && image.links.html && !imageError && (
          <div className="visit-button-container">
            <a 
              href={image.links.html} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="visit-button"
            >
              Visitar
            </a>
          </div>
        )}
      </div>
      
      <div className="user-info-container">
        <div className="user-avatar-container">
          {image.user.profile_image && image.user.profile_image.small ? (
            <img 
              src={image.user.profile_image.small} 
              alt={image.user.name || 'Usuario'} 
              className="user-avatar"
              style={{ borderColor: avatarBorderColor }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div 
              className="user-avatar-placeholder" 
              style={{ backgroundColor: getRandomColor(), borderColor: avatarBorderColor }}
            >
              {getUserInitials(image.user.name || 'U')}
            </div>
          )}
          <div 
            className="user-avatar-placeholder" 
            style={{ 
              backgroundColor: getRandomColor(), 
              borderColor: avatarBorderColor, 
              display: 'none' 
            }}
          >
            {getUserInitials(image.user.name || 'U')}
          </div>
        </div>
        <div className="user-details">
          <span className="user-name">{image.user.name || 'Usuario desconocido'}</span>
          <span className="upload-date">{formatDate(image.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
