import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import Header from '../../Component/Header';
import { Footer } from '../../Component/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-200 to-red-200">
      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 lex-grow flex items-start justify-start">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 lex-grow flex items-start justify-start">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
            >
              Login
            </button>
          </form>

          {/* ✅ Sign Up Link */}
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
