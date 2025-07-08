import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import Header from '../../Component/Header';
import { Footer } from '../../Component/Footer';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Signup successful!');
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-red-100 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-2 border-green-400">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 lex-grow flex items-start justify-start">Full Name</label>
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
              <label className="block mb-1 text-sm font-medium text-gray-700 lex-grow flex items-start justify-start">Email Address</label>
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
              <label className="block mb-1 text-sm font-medium text-gray-700 lex-grow flex items-start justify-start">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 lex-grow flex items-start justify-start">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
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
