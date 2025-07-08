import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-green-500 to-red-500 shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-2 text-white text-2xl font-bold">
          <img src="/logo.png" alt="Logo" className="h-8 drop-shadow-md" />
          <span>Labelary Seats</span>
        </div>

        <div className="space-x-4">
          <Link
            to="/signup"
            className="px-4 py-2 bg-white text-green-600 rounded font-semibold shadow hover:bg-green-100 transition"
          >
            Sign Up
          </Link>
          
          <Link
            to="/login"
            className="px-4 py-2 bg-white text-red-600 rounded font-semibold shadow hover:bg-red-100 transition"
          >
            Login
          </Link>
        </div>

      </div>
    </header>
  );
}
