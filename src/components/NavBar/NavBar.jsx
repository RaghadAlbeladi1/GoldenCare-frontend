import { Link, useNavigate } from "react-router";
import * as usersAPI from "../../utilities/users-api";
import logo from "../../assets/images/GoldenCarelogo.png";
import "./NavBar.css";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    usersAPI.logout();
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo-section">
        <img src={logo} alt="GoldenCare Logo" className="logo" />
      </Link>

      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/caregivers">Caregivers</Link></li>
        {user ? (
          <li><button onClick={handleLogout} className="login-btn" type="button">Logout</button></li>
        ) : (
          <li><Link to="/login" className="login-btn">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
