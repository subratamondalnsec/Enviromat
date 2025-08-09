import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Heart, MessageCircle, Calendar, User, Tag } from 'lucide-react';
import { getBlogById } from '../../../services/operations/communityApi';
import { toggleLikeBlog, addCommentToBlog } from '../../../services/operations/communityApi';

const BlogDetailsModal = ({ show, onClose, blogId }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile || {});

  useEffect(() => {
    if (show && blogId) {
      loadBlogDetails();
    }
  }, [show, blogId]);

  const loadBlogDetails = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getBlogById(blogId));
      if (response?.data) {
        setBlog(response.data);
      }
    } catch (error) {
      console.error('Error loading blog details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking || !user) return;
    
    setIsLiking(true);
    try {
      await dispatch(toggleLikeBlog(blogId));
      // Refresh blog details to get updated like count
      await loadBlogDetails();
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting || !user) return;

    setIsCommenting(true);
    try {
      await dispatch(addCommentToBlog(blogId, commentText.trim()));
      setCommentText('');
      // Refresh blog details to get updated comments
      await loadBlogDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading blog details...</p>
            </div>
          ) : blog ? (
            <div className="space-y-6">
              {/* Blog Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={blog.author?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${blog.author?.firstName || 'A'}%20${blog.author?.lastName || 'U'}`}
                      alt="Author"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {`${blog.author?.firstName || ''} ${blog.author?.lastName || ''}`.trim() || 'Anonymous User'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        {blog.category && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
              </div>

              {/* Blog Image */}
              {blog.image && (
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {blog.content}
                </p>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLike}
                  disabled={isLiking || !user}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isLiking || !user
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>{blog.likesCount || 0} Likes</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blog.commentsCount || (blog.comments?.length || 0)} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Comments ({blog.comments?.length || 0})
                </h3>

                {/* Add Comment Form - Only for authenticated users */}
                {user && (
                  <form onSubmit={handleAddComment} className="flex space-x-3">
                    <img
                      src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || 'A'}%20${user.lastName || 'U'}`}
                      alt="Your avatar"
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-grow flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        maxLength={200}
                      />
                      <button
                        type="submit"
                        disabled={isCommenting || !commentText.trim()}
                        className={`px-4 py-2 bg-green-600 text-white rounded-lg transition-colors ${
                          isCommenting || !commentText.trim()
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-green-700'
                        }`}
                      >
                        {isCommenting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {blog.comments?.length ? (
                    blog.comments.map((comment, index) => (
                      <div key={index} className="flex space-x-3 bg-gray-50 rounded-lg p-3">
                        <img
                          src={comment.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.firstName || 'A'}%20${comment.user?.lastName || 'U'}`}
                          alt="Commenter"
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900 text-sm">
                            {`${comment.user?.firstName || ''} ${comment.user?.lastName || ''}`.trim() || 'Anonymous User'}
                          </p>
                          <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No comments yet. {user ? 'Be the first to comment!' : 'Login to add a comment.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">😞</div>
              <p className="text-gray-600">Failed to load blog details</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogDetailsModal;
