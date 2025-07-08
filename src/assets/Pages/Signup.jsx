import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Component/Header';
import { Footer } from '../../Component/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
console.log("form data is", form.password == form.confirmPassword)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password != form.confirmPassword ) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('https://ticket-booking-1uxh.onrender.com/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          password: form.password,
          confirmPassword:form.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful!');
        console.log('API response:', data);
        window.location.href = '/login';
      } else {
        alert(`Signup failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-red-100 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-2 border-green-400">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-left">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-left">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-left">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-left">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
