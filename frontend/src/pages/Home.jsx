import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import PageWrapper from '../components/PageWrapper';
import { SkeletonGrid } from '../components/Skeleton';
import { postAPI } from '../services/api';
import { toast } from 'react-toastify';

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
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
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
        </motion.div>

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Posts Grid */}
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : posts.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-syne font-bold text-ink-primary mb-2">
              No items found
            </h2>
            <p className="text-ink-secondary">
              Try adjusting your search filters or check back later
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Home;
