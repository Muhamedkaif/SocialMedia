import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SocialSnap</h1>
          <p className="text-gray-400 text-sm">Sign up to see photos from your friends</p>
        </div>

        {/* Register Form */}
        <div className="bg-[#262626] border border-[#363636] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                data-testid="register-error-message"
                className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                data-testid="register-email-input"
                className="w-full bg-black border border-[#363636] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            <div>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                data-testid="register-displayname-input"
                className="w-full bg-black border border-[#363636] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                data-testid="register-username-input"
                className="w-full bg-black border border-[#363636] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                data-testid="register-password-input"
                className="w-full bg-black border border-[#363636] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              data-testid="register-submit-btn"
              className="w-full bg-[#0095f6] hover:bg-[#0084e0] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="bg-[#262626] border border-[#363636] rounded-lg p-6 mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Have an account?{' '}
            <Link
              to="/login"
              data-testid="login-link"
              className="text-[#0095f6] hover:text-white font-semibold transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
