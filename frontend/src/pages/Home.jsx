import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import PageWrapper from '../components/PageWrapper';
import { SkeletonGrid } from '../components/Skeleton';
import { postAPI } from '../services/api';
import { toast } from 'react-toastify';

// Demo posts for development/when no real posts exist
const DEMO_POSTS = [
  {
    _id: 'demo-1',
    type: 'lost',
    title: 'Gold Wedding Ring - Lost Near Gate',
    description: 'Lost a gold wedding ring with diamond stone near the main gate. Very sentimental. Reward offered!',
    location: 'Main Gate, Building A',
    category: 'Wallet',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
    status: 'open',
    createdBy: {
      _id: 'demo-user-1',
      name: 'Raj Kumar',
      email: 'raj@example.com'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-2',
    type: 'found',
    title: 'Black Puppy Found - Needs Owner',
    description: 'Found a cute black puppy near the parking lot. Has a collar but tag is faded. Looking for owner!',
    location: 'Parking Lot, Wing C',
    category: 'Pet',
    imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30628ae9c15?w=400&h=300&fit=crop',
    status: 'open',
    createdBy: {
      _id: 'demo-user-2',
      name: 'Priya Singh',
      email: 'priya@example.com'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-3',
    type: 'lost',
    title: 'iPhone 14 Pro - Lost Yesterday',
    description: 'Lost my iPhone 14 Pro in black color. Has a blue case with a crack. Please help!',
    location: 'Community Center',
    category: 'Phone',
    imageUrl: 'https://images.unsplash.com/photo-1592286927505-1fed540c3d82?w=400&h=300&fit=crop',
    status: 'open',
    createdBy: {
      _id: 'demo-user-3',
      name: 'Amit Sharma',
      email: 'amit@example.com'
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-4',
    type: 'found',
    title: 'Brown Wallet Found - Has Keys',
    description: 'Found a brown leather wallet with car keys inside. Owner details inside. Please contact!',
    location: 'Guest Parking',
    category: 'Wallet',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    status: 'open',
    createdBy: {
      _id: 'demo-user-4',
      name: 'Neha Patel',
      email: 'neha@example.com'
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-5',
    type: 'lost',
    title: 'Important Documents - Lost in Lobby',
    description: 'Lost a brown folder with important documents. Please notify if found!',
    location: 'Building Lobby',
    category: 'Documents',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
    status: 'open',
    createdBy: {
      _id: 'demo-user-5',
      name: 'Vikram Menon',
      email: 'vikram@example.com'
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-6',
    type: 'found',
    title: 'Set of Keys - Found Near Gate',
    description: 'Found a set of keys with a red keychain near the main gate. No name tag visible.',
    location: 'Main Gate',
    category: 'Keys',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
    status: 'open',
    createdBy: {
      _id: 'demo-user-6',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchParams, setSearchParams] = useState({
    q: '',
    type: '',
    category: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postAPI.getAllPosts(searchParams);
      const fetchedPosts = response.data.posts || [];
      
      // If no posts from API, show demo posts
      if (fetchedPosts.length === 0) {
        setPosts(filterDemoPosts(DEMO_POSTS, searchParams));
        setIsDemoMode(true);
      } else {
        setPosts(fetchedPosts);
        setIsDemoMode(false);
      }
    } catch (error) {
      // If backend is not running, show demo posts
      if (error.message.includes('refused') || error.message.includes('Connection')) {
        setPosts(filterDemoPosts(DEMO_POSTS, searchParams));
        setIsDemoMode(true);
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch posts');
        setPosts([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterDemoPosts = (posts, params) => {
    return posts.filter(post => {
      const matchSearch = !params.q || 
        post.title.toLowerCase().includes(params.q.toLowerCase()) ||
        post.description.toLowerCase().includes(params.q.toLowerCase());
      
      const matchType = !params.type || post.type === params.type;
      const matchCategory = !params.category || post.category === params.category;
      
      return matchSearch && matchType && matchCategory;
    });
  };

  const handleSearch = (query) => {
    setSearchParams({ ...searchParams, q: query });
  };

  const handleTypeChange = (type) => {
    setSearchParams({ ...searchParams, type });
  };

  const handleCategoryChange = (category) => {
    setSearchParams({ ...searchParams, category });
  };

  const clearFilters = () => {
    setSearchParams({ q: '', type: '', category: '' });
  };

  return (
    <PageWrapper>
      <div className="container-lg px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-5xl font-syne font-bold mb-4 text-ink-primary">
            Lost & Found Hub
          </h1>
          <p className="text-lg text-ink-secondary font-dm font-light leading-relaxed">
            Find or post lost and found items in your community
          </p>
          {isDemoMode && (
            <motion.div
              className="mt-4 inline-block px-4 py-2 bg-accent-soft rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-accent font-medium">
                📌 Demo Mode: Showing sample posts. Start backend to see real posts!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Posts Grid */}
        {isLoading ? (
          <div data-loading="true">
            <SkeletonGrid count={6} />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-ink-primary mb-2">
              No results found
            </h3>
            <p className="text-ink-muted mb-6">
              Try different keywords or clear your filters.
            </p>
            <button 
              onClick={clearFilters} 
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-loading="true">
            <AnimatePresence initial={false}>
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={index < 6 ? { opacity: 0, y: 12 } : false}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index < 6 ? index * 0.03 : 0,
                      duration: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  exit={false}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Home;
