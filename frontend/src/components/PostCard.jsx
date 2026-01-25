import React, { useState, useCallback } from 'react';
import { Trash2, User as UserIcon } from 'lucide-react';
import { postService } from '@/services/postService';

const PostCard = ({ post, currentUser, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Defensive guard (VERY IMPORTANT)
  if (!post || !post.id) {
    return null;
  }

  // ✅ Owner check using backend userId
 const isOwner =
  currentUser?.username &&
  post?.username &&
  currentUser.username === post.username;



  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (!confirmed) return;

    try { 
      setIsDeleting(true);
      await postService.deletePost(post.id);
      onDelete?.(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }, [post.id, isDeleting, onDelete]);

  return (
    <article
      data-testid="post-card"
      className="bg-black border border-[#363636] rounded-lg overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-3">
        

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete post"
            data-testid="delete-post-btn"
            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 size={20} />
          </button>
        )}
      </header>

      {/* Image */}
      {post.imageUrl && (
        <div className="w-full aspect-square bg-[#262626]">
          <img
            src={`https://socialmedia-y0ij.onrender.com${post.imageUrl}`}
            alt="Post"
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      {post.text && (
        <div className="p-4">
          <p className="text-white text-sm">
            {post.text}
          </p>
        </div>
      )}
    </article>
  );
};

export default PostCard;
