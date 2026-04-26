import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Messages = lazy(() => import('./pages/Messages'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="inline-flex items-center gap-2 text-sm font-dm text-ink-secondary">
        <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span>Loading page...</span>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const isLandingPage = !isAuthenticated && location.pathname === '/';
  const isAuthEntryPage =
    !isAuthenticated &&
    (location.pathname === '/login' || location.pathname === '/register');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-sm font-dm text-ink-secondary">
          <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span>Loading application...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar floating={isLandingPage} dockOnLoad={isAuthEntryPage} />

      <div className={isLandingPage ? '' : 'pt-20'}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />}
            />
            <Route path="/home" element={<Home />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
            />
            <Route path="/post/:id" element={<PostDetail />} />

            {/* Protected Routes */}
            <Route
              path="/my-posts"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-post/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative z-10 min-h-screen" style={{ transform: 'translateZ(0)' }}>
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
