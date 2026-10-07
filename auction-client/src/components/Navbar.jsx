import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Klubban
        </Link>

        <nav className="navbar__links" aria-label="Huvudmeny">
          <NavLink to="/" end>
            Auktioner
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/my-auctions">Mina auktioner</NavLink>
              <Link to="/auctions/new" className="button button--small">
                Skapa auktion
              </Link>
              <span className="navbar__user">{user.name}</span>
              <button type="button" className="link-button" onClick={handleLogout}>
                Logga ut
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Logga in</NavLink>
              <Link to="/register" className="button button--small">
                Skapa konto
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
