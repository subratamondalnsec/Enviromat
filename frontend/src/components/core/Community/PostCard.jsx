// components/PostCard.jsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {FaHeart} from 'react-icons/fa'
import { MessageCircle, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { toggleLikeBlog, addCommentToBlog, deleteBlog } from '../../../services/operations/communityApi';
import { DEFAULT_AVATAR } from '../../../utils/constants';



const PostCard = ({ post, onLike, onAddComment, refSetter, onViewDetails, onEditPost }) => {
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile || {});

  // Check if current user is the author of this post
  const isAuthor = user && user._id === post.author?._id;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await dispatch(toggleLikeBlog(post._id));
      // Redux state is updated automatically in the API function
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteBlog(post._id));
      // The post will be removed from Redux state automatically
      setShowDropdown(false);
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = () => {
    setShowDropdown(false);
    if (onViewDetails) {
      onViewDetails(post._id);
    }
  };

  const handleEdit = () => {
    setShowDropdown(false);
    if (onEditPost) {
      onEditPost(post);
    }
  };

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if(!commentText.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      await dispatch(addCommentToBlog(post._id, commentText.trim()));
      // Redux state is updated automatically in the API function
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = date => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const shortDescription = post.content && post.content.length > 150 ? post.content.slice(0,150) + '...' : (post.content || '');

  const comments = post.comments || [];
  const commentsToShow = showAllComments ? comments : comments.slice(0,2);

  return (
    <motion.div
      ref={refSetter}
      className="bg-white rounded-3xl shadow p-6 border border-gray-200 hover:shadow-md transition relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
        <div className="mb-4">
        <div className="flex justify-between text-gray-500 text-md mb-4">
            <div className="flex items-center text-purple-500">
                <img 
                  src={post.author?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.firstName || 'A'}%20${post.author?.lastName || 'U'}`} 
                  alt={`${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'User'} 
                  className="w-8 h-8 rounded-full mr-2" 
                />
                <span>{`${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'Anonymous User'}</span>
            </div>
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <span>{formatDate(post.createdAt)}</span>
              {post.category && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1">
                  {post.category}
                </span>
              )}
            </div>
            
            {/* Three Dots Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Post options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  {/* View Full Post - Available for everyone */}
                  <button
                    onClick={handleViewDetails}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-green-500" />
                    <span>View Full Post</span>
                  </button>

                  {/* Edit and Delete options - Only for post author */}
                  {isAuthor && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleEdit}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                        <span>Edit Post</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete Post'}</span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{post.title}</h3>
        <p className="text-gray-600 leading-relaxed">{shortDescription}</p>
      </div>

      {post.image && (
        <div className="overflow-hidden rounded-2xl mb-4">
          <img src={post.image} alt={post.title} className="w-full object-cover hover:scale-101 transition" />
        </div>
      )}

      <div className="flex gap-6 mb-4 border-b border-gray-100 pb-3">
        <button
          className={`inline-flex items-center space-x-2 text-red-500 hover:text-red-600 group ${isLiking ? 'opacity-50' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <FaHeart className="w-5 h-5 group-hover:scale-110 transition" />
          <span>{post.likesCount || 0}</span>
        </button>
        <div className="inline-flex items-center space-x-1 text-gray-500">
          <MessageCircle className="w-5 h-5" />
          <span>{post.commentsCount || (comments.length || 0)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {comments.slice(0, showAllComments ? undefined : 2).map((commentObj, idx) => (
          <div key={idx} className="bg-gray-100 rounded-xl p-3 text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <img 
                src={commentObj.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${commentObj.user?.firstName || 'A'}%20${commentObj.user?.lastName || 'U'}`} 
                alt="Commenter" 
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-gray-700">
                {`${commentObj.user?.firstName || ''} ${commentObj.user?.lastName || ''}`.trim() || 'Anonymous User'}
              </span>
            </div>
            <p className="text-gray-700">{commentObj.comment}</p>
          </div>
        ))}

        {comments.length > 2 && (
          <button
            className="text-green-600 text-sm font-semibold"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'Show less' : `View all ${comments.length} comments`}
          </button>
        )}

        <form onSubmit={onSubmitComment} className="flex space-x-2 mt-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="flex-grow border border-gray-300 rounded-xl p-2 text-sm"
            placeholder="Write a comment..."
            maxLength={200}
          />
          <button
            type="submit"
            className={`bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl ${isCommenting || !commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isCommenting || !commentText.trim()}
          >
            {isCommenting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PostCard;
