import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error("Logout error:", err.message);
      }
    };

  return (
    <header className="bg-blue-600 p-4 text-white w-full">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="text-lg font-bold">MySite</div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl ml-4"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        <nav
          className={`w-full md:w-auto ${
            menuOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-2 md:mt-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "underline font-bold" : ""
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/comments"
              className={({ isActive }) =>
                isActive ? "underline font-bold" : ""
              }
              onClick={() => setMenuOpen(false)}
            >
              Comments
            </NavLink>

            {!user && (
              <>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "underline font-bold" : ""
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Регистрация
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "underline font-bold" : ""
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Вход
                </NavLink>
              </>
            )}

            {user && (
              <>
                <span className="font-semibold">
                  Hello, {user.displayName || "Guest"}!
                </span>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "underline font-bold" : ""
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left md:text-center underline"
                >
                  Изход
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
