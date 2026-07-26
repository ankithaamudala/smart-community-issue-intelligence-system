import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/report" className="sidebar-link">
          <span>Report Issue</span>
        </NavLink>
        <NavLink to="/dashboard" className="sidebar-link">
          <span>Dashboard</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
