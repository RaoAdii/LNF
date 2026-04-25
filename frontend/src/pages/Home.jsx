import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import PageWrapper from '../components/PageWrapper';
import { SkeletonGrid } from '../components/Skeleton';
import { postAPI, getApiErrorMessage } from '../services/api';
import { toast } from 'react-toastify';

const HOME_FETCH_ERROR_TOAST_ID = 'home-fetch-posts-error';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setPosts(response.data.posts || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to fetch posts'), {
        toastId: HOME_FETCH_ERROR_TOAST_ID,
      });
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchParams((prev) => ({ ...prev, q: query }));
  };

  const handleTypeChange = (type) => {
    setSearchParams((prev) => ({ ...prev, type }));
  };

  const handleCategoryChange = (category) => {
    setSearchParams((prev) => ({ ...prev, category }));
  };

  const clearFilters = () => {
    setSearchParams({ q: '', type: '', category: '' });
  };

  return (
    <PageWrapper>
      <div className="container-lg px-6 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-5xl font-syne font-bold mb-4 text-ink-primary">
            Lost and Found Hub
          </h1>
          <p className="text-lg text-ink-secondary font-dm font-light leading-relaxed">
            Find or post lost and found items in your community
          </p>
        </motion.div>

        <SearchBar
          onSearch={handleSearch}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
        />

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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft mb-4">
              <SearchX size={30} className="text-accent" />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children" data-loading="true">
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
