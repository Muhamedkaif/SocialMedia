import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "../components/Navbar.jsx";
import CreatePostModal from '@/components/CreatePostModal';
import { postService } from '@/services/postService';
import { PlusSquare } from 'lucide-react';

const HomePage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Add newly created post
  const handlePostCreated = (createdPost) => {
    if (!createdPost?.id) return;
    setPosts((prev) => [createdPost, ...prev]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={user} />

      <main className="pt-20 pb-8 max-w-2xl mx-auto px-4">
        {/* Create Post */}
        {user && (
          <div className="mb-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-[#262626] border border-[#363636] rounded-lg p-4
                         flex items-center justify-center gap-2
                         hover:bg-[#2a2a2a] transition-colors"
            >
              <PlusSquare size={20} className="text-[#0095f6]" />
              <span className="text-white font-medium">Create New Post</span>
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading posts...
          </div>
        )}

        {/* No posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No posts yet
          </div>
        )}

        {/* POSTS FEED */}
        {!loading && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-black border border-[#363636] rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div className="p-3 text-white font-semibold text-sm">
                  {post.username ?? 'Unknown'}
                </div>

                {/* Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="post"
                    className="w-full object-cover"
                  
                  />
                )}

                {/* Text (ALWAYS render) */}
                <div className="p-4 text-white text-sm">
                  {post.text
                    ? post.text
                    : <span className="text-gray-500">No caption</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default HomePage;
