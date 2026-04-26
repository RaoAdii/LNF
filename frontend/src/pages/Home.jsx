import React, { useEffect, useMemo, useState } from 'react';
import { SearchX, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import PageWrapper from '../components/PageWrapper';
import { SkeletonGrid } from '../components/Skeleton';
import { postAPI, getApiErrorMessage } from '../services/api';
import { toast } from 'react-toastify';

const HOME_FETCH_ERROR_TOAST_ID = 'home-fetch-posts-error';
const PAGE_SIZE = 9;
const HOME_CACHE_VERSION = 'v1';
const HOME_CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_SEARCH_PARAMS = {
  q: '',
  type: '',
  category: '',
};

const EMPTY_SUMMARY = {
  lostCount: 0,
  foundCount: 0,
  resolvedCount: 0,
};

const EMPTY_META = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
  hasMore: false,
};

const getHomeCacheKey = (params) =>
  `home:listings:${HOME_CACHE_VERSION}:${encodeURIComponent(JSON.stringify(params || DEFAULT_SEARCH_PARAMS))}`;

const readCachedListings = (params) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(getHomeCacheKey(params));
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    const ageMs = Date.now() - Number(parsed?.cachedAt || 0);
    if (!Number.isFinite(ageMs) || ageMs > HOME_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(getHomeCacheKey(params));
      return null;
    }

    if (!Array.isArray(parsed?.posts) || !parsed?.meta || !parsed?.summary) {
      return null;
    }

    return {
      posts: parsed.posts,
      meta: parsed.meta,
      summary: parsed.summary,
    };
  } catch (_error) {
    return null;
  }
};

const writeCachedListings = (params, payload) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(
      getHomeCacheKey(params),
      JSON.stringify({
        ...payload,
        cachedAt: Date.now(),
      })
    );
  } catch (_error) {
    // Ignore storage write errors.
  }
};

const Home = () => {
  const [initialCachedData] = useState(() => readCachedListings(DEFAULT_SEARCH_PARAMS));
  const [posts, setPosts] = useState(() => initialCachedData?.posts || []);
  const [isLoading, setIsLoading] = useState(() => !initialCachedData);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [summary, setSummary] = useState(() => initialCachedData?.summary || EMPTY_SUMMARY);
  const [meta, setMeta] = useState(() => initialCachedData?.meta || EMPTY_META);
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);

  const summaryCards = useMemo(
    () => [
      { label: 'Lost Items', value: summary.lostCount, icon: ShieldCheck },
      { label: 'Found Items', value: summary.foundCount, icon: Sparkles },
      { label: 'Resolved', value: summary.resolvedCount, icon: Zap },
    ],
    [summary]
  );

  const fetchPosts = async ({ page = 1, append = false } = {}) => {
    const isFirstPage = !append && page === 1;
    const cachedPayload = isFirstPage ? readCachedListings(searchParams) : null;

    if (append) {
      setIsLoadingMore(true);
    } else if (!cachedPayload) {
      setIsLoading(true);
    } else {
      setPosts(cachedPayload.posts);
      setMeta(cachedPayload.meta);
      setSummary(cachedPayload.summary);
      setIsLoading(false);
    }

    try {
      const response = await postAPI.getAllPosts({
        ...searchParams,
        page,
        limit: PAGE_SIZE,
      });

      const incomingPosts = response.data?.posts || [];
      const incomingMeta = response.data?.meta || EMPTY_META;
      const incomingSummary = response.data?.summary || EMPTY_SUMMARY;

      setPosts((previous) => (append ? [...previous, ...incomingPosts] : incomingPosts));
      setMeta({
        page: incomingMeta.page || page,
        limit: incomingMeta.limit || PAGE_SIZE,
        total: incomingMeta.total || 0,
        totalPages: incomingMeta.totalPages || 1,
        hasMore: Boolean(incomingMeta.hasMore),
      });
      setSummary(incomingSummary);

      if (isFirstPage) {
        writeCachedListings(searchParams, {
          posts: incomingPosts,
          meta: {
            page: incomingMeta.page || page,
            limit: incomingMeta.limit || PAGE_SIZE,
            total: incomingMeta.total || 0,
            totalPages: incomingMeta.totalPages || 1,
            hasMore: Boolean(incomingMeta.hasMore),
          },
          summary: incomingSummary,
        });
      }
    } catch (error) {
      if (!append && !cachedPayload) {
        toast.error(getApiErrorMessage(error, 'Failed to fetch posts'), {
          toastId: HOME_FETCH_ERROR_TOAST_ID,
        });
        setPosts([]);
        setMeta(EMPTY_META);
        setSummary(EMPTY_SUMMARY);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts({ page: 1, append: false });
  }, [searchParams]);

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

  const handleLoadMore = () => {
    if (!meta.hasMore || isLoadingMore || isLoading) {
      return;
    }
    fetchPosts({ page: meta.page + 1, append: true });
  };

  return (
    <PageWrapper>
      <div className="container-lg px-4 md:px-6 py-8 md:py-10">
        <section className="mb-6">
          <h1 className="text-2xl md:text-3xl font-syne font-bold text-ink-primary">Latest Listings</h1>
          <p className="text-sm text-ink-secondary font-dm mt-1">
            Showing {posts.length} of {meta.total} listings
          </p>
        </section>

        <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {summaryCards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl bg-[#18142d]/85 border border-white/15 px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.32)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-secondary font-dm">{label}</p>
                <Icon size={14} className="text-accent" />
              </div>
              <p className="text-2xl font-syne font-bold text-ink-primary mt-1">
                {(Number(value) || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        <SearchBar
          onSearch={handleSearch}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
        />

        <section id="listing-feed" className="mb-5" />

        {isLoading ? (
          <div data-loading="true">
            <SkeletonGrid count={6} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft mb-4">
              <SearchX size={30} className="text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-ink-primary mb-2">No results found</h3>
            <p className="text-ink-muted mb-6">Try different keywords or clear your filters.</p>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-loading="true">
              {posts.map((post, index) => (
                <div key={post._id} className="h-full">
                  <PostCard post={post} priority={index < 3} />
                </div>
              ))}
            </div>

            {meta.hasMore && (
              <div className="mt-8 text-center">
                <button onClick={handleLoadMore} disabled={isLoadingMore} className="btn btn-secondary min-w-[180px]">
                  {isLoadingMore ? 'Loading more...' : 'Load More Listings'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default Home;
