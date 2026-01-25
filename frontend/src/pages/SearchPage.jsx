import React, { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import { Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/search?query=${query}`);
      
      const result = Array.isArray(res.data)
      ? res.data
      : res.data.data || res.data.content || [];

    setUsers(result);
    } catch (err) {
      setError('Failed to search users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
      <Navbar />
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Search Users</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
          <div className="flex items-center w-full bg-[#1a1a1a] border border-[#363636] rounded-lg px-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none px-2 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </form>

        {/* States */}
        {loading && <p className="text-gray-400">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Results */}
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/${user.username}/profile`)}
              className="cursor-pointer bg-[#0f0f0f] border border-[#363636] rounded-lg p-3 hover:bg-[#1a1a1a]"
            >
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-400">{user.displayName}</p>
            </div>
          ))}

           {users.length === 0 && query && (
            <p className="text-gray-500">No users found </p>
          )}
         
        </div>
      </div>
    </div>
    </>
  );
};

export default UserSearchPage;
