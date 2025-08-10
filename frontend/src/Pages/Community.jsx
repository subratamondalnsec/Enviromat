import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import PostCard from "../components/core/Community/PostCard";
import CreatePostModal from "../components/core/Community/CreatePost";
import BlogFilters from "../components/core/Community/BlogFilters";
import BlogDetailsModal from "../components/core/Community/BlogDetailsModal";
import EditPostModal from "../components/core/Community/EditPostModal";
import { getAllBlogs, toggleLikeBlog, addCommentToBlog } from "../services/operations/communityApi";
import { setLoading, setBlogs, removeBlog } from "../slices/communitySlice";


const CommunityPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState(null);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);
  
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.community);

  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const postsRef = useRef([]);

  useEffect(() => {
    // Load blogs from backend on component mount
    const loadBlogs = async () => {
      try {
        dispatch(setLoading(true));
        const response = await dispatch(getAllBlogs());
        if (response && response.data) {
          dispatch(setBlogs(response.data));
          
          // Show welcome toast only once per session
          const hasShownToast = sessionStorage.getItem('communityWelcomeToastShown');
          if (!hasShownToast && !hasShownWelcomeToast) {
            toast.success(`Welcome! ${response.data.length} blog${response.data.length !== 1 ? 's' : ''} loaded`);
            sessionStorage.setItem('communityWelcomeToastShown', 'true');
            setHasShownWelcomeToast(true);
          }
        }
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadBlogs();
  }, [dispatch, hasShownWelcomeToast]);

  // Initialize toast state from session storage on component mount
  useEffect(() => {
    const hasShownToast = sessionStorage.getItem('communityWelcomeToastShown');
    if (hasShownToast) {
      setHasShownWelcomeToast(true);
    }
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      const elements = [headerRef.current, ...postsRef.current.filter(Boolean)];
      gsap.set(elements, { y: 30, opacity: 0 });
      const tl = gsap.timeline();
      tl.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }).to(
        postsRef.current.filter(Boolean),
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
    }, pageRef);
    return () => ctx.revert();
  }, [blogs]);

  // Event handlers
  const handleAddPost = (newPost) => {
    // The post will be added to Redux state via the createBlog API call
    // No need to manually update local state
    setShowCreateModal(false);
  };

  const handleViewDetails = (blogId) => {
    setSelectedBlogId(blogId);
    setShowDetailsModal(true);
  };

  const handleEditPost = (post) => {
    setSelectedBlogForEdit(post);
    setShowEditModal(true);
  };

  const handleFilterChange = (filterType, data) => {
    if (filterType === 'all') {
      setFilteredBlogs([]);
    } else if (filterType === 'most-liked') {
      setFilteredBlogs(data || []);
    } else if (filterType === 'category') {
      setFilteredBlogs(data || []);
    }
  };

  const handleLike = async (blogId) => {
    try {
      await dispatch(toggleLikeBlog(blogId));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleAddComment = async (blogId, comment) => {
    try {
      await dispatch(addCommentToBlog(blogId, comment));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const addPostRef = (el, index) => {
    postsRef.current[index] = el;
  };

  // Determine which blogs to display
  const displayBlogs = filteredBlogs.length > 0 ? filteredBlogs : blogs;

  return (
    <section ref={pageRef} className="min-h-screen bg-[#F9FAFB] py-8 relative">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, #10B981 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex justify-between items-center my-16"
        >
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-purple-400">Community</span>{" "}
              <span className="text-green-400">Blog</span>
            </h1>
            <p className="text-gray-600 text-lg mt-4 max-w-xl">
              Share your waste management journey and inspire others with your
              sustainable living stories
            </p>
          </div>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#cb8fff] border border-[#C27BFF] hover:bg-[#d2a4fa] text-gray-700 font-semibold flex items-center gap-2 rounded-full px-3 py-2 shadow-md transition-all duration-300 hover:scale-102"
            aria-label="Create new post"
          >
            <Plus className="w-5 h-5" /> Create New
          </button>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleAddPost}
        />

        {/* Blog Details Modal */}
        <BlogDetailsModal
          show={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          blogId={selectedBlogId}
        />

        {/* Edit Post Modal */}
        <EditPostModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          post={selectedBlogForEdit}
        />

        {/* Blog Filters */}
        <BlogFilters onFilterChange={handleFilterChange} />

        {/* Posts Grid */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center py-16"
            >
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Loading posts...
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the latest community posts
              </p>
            </motion.div>
          ) : displayBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center py-16"
            >
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {blogs.length === 0 ? "No posts yet" : "No posts found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {blogs.length === 0 
                  ? "Be the first to share your sustainable journey!"
                  : "Try changing your filter or create a new post!"
                }
              </p>
              {blogs.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
                >
                  Create First Post
                </button>
              )}
            </motion.div>
          ) : (
            displayBlogs.map((post, idx) => (
              <motion.div
                key={post._id}
                className="break-inside-avoid mb-6 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <PostCard
                  post={post}
                  onLike={() => handleLike(post._id)}
                  onAddComment={(comment) => handleAddComment(post._id, comment)}
                  onViewDetails={handleViewDetails}
                  onEditPost={handleEditPost}
                  refSetter={(el) => addPostRef(el, idx)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityPage;
