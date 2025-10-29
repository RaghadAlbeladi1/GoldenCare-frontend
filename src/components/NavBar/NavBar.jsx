import { Link, useNavigate } from "react-router-dom";
import * as usersAPI from "../../utilities/users-api";
import logo from "../../assets/images/GoldenCarelogo.png";
import profileIcon from "../../assets/images/profilepicforEHR.jpg";
import { useState } from "react";

export default function NavBar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    usersAPI.logout();
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-section">
          <img src={logo} alt="GoldenCare Logo" className="logo" />
          <span className="app-name">GoldenCare</span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
        <li><Link to="/caregivers">Caregivers</Link></li>

        {!user ? (
          <li><Link to="/login" className="login-btn">Login</Link></li>
        ) : (
          <li className="profile-menu">
            <img
              src={profileIcon}
              alt="Patient"
              className="profile-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
