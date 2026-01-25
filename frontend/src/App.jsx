import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import SearchPage from '@/pages/SearchPage';




import '@/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.log('Not authenticated');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser}/>}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage  />}
        />
        <Route path="/:username/profile" element={<ProfilePage />} />
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <HomePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
           
              <ProfilePage user={user} />
          
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <ProfilePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <SearchPage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
