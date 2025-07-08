import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [userName, setUserName] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Watch for route changes
console.log('the user name is', userName)
  // 🔄 Update userName whenever route or localStorage changes
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    console.log("the stored name", storedName)
    setUserName(storedName);
  }, [location]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch('https://ticket-booking-1uxh.onrender.com/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Logout success:', data.message);
      } else {
        console.warn('Logout failed:', data.message || 'Unknown error');
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      setUserName(null);
      navigate('/login');

    } catch (error) {
      console.error('Logout error:', error);
      alert('Something went wrong while logging out.');
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-green-500 to-red-500 shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-2 text-white text-2xl font-bold">
          <img src="/logo.png" alt="Logo" className="h-8 drop-shadow-md" />
          <span>Labelary Seats</span>
        </div>

        <div className="relative">
          {!userName ? (
            <div className="space-x-4">
              <Link
                to="/signup"
                className="px-4 py-2 bg-white text-green-600 rounded font-semibold shadow hover:bg-green-100 transition">
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-red-600 rounded font-semibold shadow hover:bg-red-100 transition">
                Login
              </Link>
            </div>
          ) : (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-white font-semibold hover:opacity-90 focus:outline-none">
                <FaUserCircle className="text-xl" />
                <span>{userName}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-50">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
