import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const LoginPage = ({setUser}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
       const userData = await authService.login(formData);
      setUser(userData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'password or email is wrong');
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
          <p className="text-gray-400 text-sm">Sign in to see photos from your friends</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#262626] border border-[#363636] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                data-testid="login-error-message"
                className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </div>
            )}

            <div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email"
                required
                data-testid="login-email-input"
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
                data-testid="login-password-input"
                className="w-full bg-black border border-[#363636] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#0095f6]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              data-testid="login-submit-btn"
              className="w-full bg-[#0095f6] hover:bg-[#0084e0] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="bg-[#262626] border border-[#363636] rounded-lg p-6 mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              data-testid="register-link"
              className="text-[#0095f6] hover:text-white font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
