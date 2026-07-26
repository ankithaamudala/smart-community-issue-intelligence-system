import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">Smart Community IQ</Link>
      </div>

      <nav className="navbar-links">
        <NavLink to="/">Home</NavLink>
      </nav>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <NotificationBell />
            <span className="user-chip">{user?.name}</span>
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/signup" className="btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

