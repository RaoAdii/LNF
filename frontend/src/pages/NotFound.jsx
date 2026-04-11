import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="text-8xl font-black text-ink-primary opacity-10 font-syne">
            404
          </div>
          
          <h1 className="text-4xl font-bold text-ink-primary">
            Page not found
          </h1>
          
          <p className="text-ink-muted max-w-sm mx-auto text-lg">
            The page you're looking for doesn't exist or the item may have been removed.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              <button className="btn btn-primary">
                Go Back Home
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
