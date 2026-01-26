import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { postService } from '@/services/postService';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setText('');
      setImage(null);
      setImagePreview('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Trim-safe validation
    if (!text.trim() && !image) {
      alert('Please add some text or an image');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // ✅ MUST match backend @RequestParam("text")
      formData.append('text', text.trim());

      // ✅ Optional image
      if (image) {
        formData.append('image', image);
      }

      // ❌ DO NOT set headers here
      const createdPost = await postService.createPost(formData);

      // ✅ Update feed instantly
      onPostCreated?.(createdPost);
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#262626] rounded-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#363636]">
          <h2 className="text-white text-lg font-semibold">Create New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a caption..."
            rows={4}
            className="w-full bg-black border border-[#363636] rounded-lg p-3 text-white resize-none focus:outline-none focus:border-[#0095f6]"
          />

          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#363636] rounded-lg cursor-pointer hover:border-[#0095f6] transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-gray-400 text-sm">Click to upload image</p>
            </div>
          </label>

          {imagePreview && (
          <img
          src={imagePreview}
          alt="Preview"
          className="w-full max-h-[300px] object-contain rounded-lg"
          />
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0095f6] hover:bg-[#0084e0] text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Share Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
