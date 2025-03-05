import { Link } from "react-router-dom";
import Auth from "../utils/auth.js";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Search for Books</Link>
      {Auth.loggedIn() ? (
        <>
          <Link to="/saved">Saved Books</Link>
          <button onClick={Auth.logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
