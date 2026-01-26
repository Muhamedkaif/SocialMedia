import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar.jsx";
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { User as UserIcon } from 'lucide-react';
import PostCard from '@/components/PostCard';

const ProfilePage = ({ user }) => {
  const { username } = useParams();

  // 🔥 KEY LOGIC
  const isOwnProfile = !username || username === user?.username;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // ============================
  // FETCH PROFILE + POSTS
  // ============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const profileData = isOwnProfile
          ? await authService.getCurrentUser()
          : await userService.getUserProfile(username);

        setProfile(profileData);

        const postsData = await userService.getUserPosts(profileData.username);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error('Profile fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, isOwnProfile]);

  // ============================
  // PROFILE IMAGE UPLOAD (OWN ONLY)
  // ============================
  const handleProfileClick = () => {
    if (isOwnProfile) fileInputRef.current.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const res = await axios.post(
  "/api/users/profile-image",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, 
  }
);

      setProfile(prev => ({
        ...prev,
        profileImage: res.data.profileImage
      }));
    } catch (err) {
      console.error('Profile image upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  // ============================
  // LOADING / ERROR STATES
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar user={user} />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin h-10 w-10 border-t-2 border-white rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar user={user} />
        <div className="flex justify-center items-center min-h-screen text-gray-400">
          User not found
        </div>
      </div>
    );
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="min-h-screen bg-black">
      <Navbar user={user} />

      {/* Hidden input (own profile only) */}
      {isOwnProfile && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
      )}

      <div className="pt-20 max-w-4xl mx-auto px-4">

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-8 mb-10">

          {/* Profile image */}
          <div
            onClick={handleProfileClick}
            className={`relative w-32 h-32 rounded-full bg-[#262626] overflow-hidden flex items-center justify-center
              ${isOwnProfile ? 'cursor-pointer hover:opacity-80' : ''}`}
          >
            {profile.profileImage ? (
              <img
                src={`https://socialmedia-y0ij.onrender.com${profile.profileImage}`}
                className="w-full h-full object-cover"
                alt="profile"
              />
            ) : (
              <UserIcon size={48} className="text-gray-400" />
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-t-2 border-white rounded-full" />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl text-white font-semibold">
              {profile.username}
            </h1>
            <p className="text-gray-400">{profile.displayName}</p>

            <div className="mt-2">
              <span className="text-white font-semibold">{posts.length}</span>
              <span className="text-gray-400 ml-1">posts</span>
            </div>
          </div>
        </div>

        {/* POSTS GRID */}
        <div className="border-t border-[#363636] pt-6">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No posts yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
              {posts.map(post => (
                <div
                  key={post.id}
                  onClick={() =>{ setSelectedPost(post);   console.log("Clicked post:", post.id);}}
                  className="aspect-square bg-[#262626] overflow-hidden cursor-pointer"
                >
                  {post.imageUrl ? (
                    <img
                      src={`https://socialmedia-y0ij.onrender.com${post.imageUrl}`}
                      className="w-full h-full object-cover"
                      alt="post"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                      {post.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)} />
          <div className="relative max-w-md w-full mx-4">
            <PostCard
              post={selectedPost}
              currentUser={user}
              onDelete={(id) => {
                setPosts(p => p.filter(post => post.id !== id));
                setSelectedPost(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
