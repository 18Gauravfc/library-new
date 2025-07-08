import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Component/Header';
import { Footer } from '../../Component/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ticket-booking-1uxh.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data?.success) {
        alert('Login successful!');
        if (data?.user) {
          localStorage.setItem('authToken', data?.user?._id);
          localStorage.setItem('userName', data?.user?.fullName || 'User');
        }
        navigate('/');
      }
    else {
            alert(`Login failed: ${data.message || 'Invalid credentials'}`);
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred during login. Please try again later.');
        }
      };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-200 to-red-200">
      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-left">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-left">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
