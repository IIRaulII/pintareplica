import { useState } from 'react';
import pinterestLogo from '../assets/pinterest-logo.png';
import searchIcon from '../assets/search-icon.svg';
import notificationIcon from '../assets/notification-icon.svg';
import messageIcon from '../assets/message-icon.svg';
import './Header.scss';

const Header = ({ onSearch, resetToInitial }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm(''); // Limpiar el input después de la búsqueda
    }
  };

  const handleLogoClick = () => {
    resetToInitial();
  };

  return (
    <header className="header">
      <div className="nav-left">
        <div className="logo-container" onClick={handleLogoClick}>
          <img src={pinterestLogo} alt="Pinterest Logo" className="logo" />
        </div>
        
        <button className="nav-button active">Inicio</button>
        <button className="nav-button">Explorar</button>
        <button className="nav-button">Crear</button>
      </div>
      
      <div className="nav-center">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-icon-container">
            <img src={searchIcon} alt="Buscar" className="search-icon-img" />
          </div>
          <input
            type="text"
            placeholder="Buscar imágenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </form>
      </div>
      
      <div className="nav-right">
        <button className="icon-button">
          <img src={notificationIcon} alt="Notificaciones" className="nav-icon-img" />
        </button>
        <button className="icon-button">
          <img src={messageIcon} alt="Mensajes" className="nav-icon-img" />
        </button>
        <button className="icon-button profile">
          <span>D</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
