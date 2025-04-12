import { Link } from "react-router-dom";
import Auth from "../utils/auth.js";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand fw-bold" to="/">
        Bookle
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Search for Books
            </Link>
          </li>

          {Auth.loggedIn() ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/saved">
                  Saved Books
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={Auth.logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
