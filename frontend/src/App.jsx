import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';

// Ambient orbs component
const AmbientOrbs = React.memo(() => (
  <div className="orbs-container fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
    {/* Orb 1: top-left, blue */}
    <div
      className="orb orb-1 absolute w-[380px] h-[380px] rounded-full"
      style={{
        top: '-100px',
        left: '-100px',
        background: 'radial-gradient(circle, #c7d7ff 0%, transparent 70%)',
        opacity: 0.22,
        transform: 'translateZ(0)',
      }}
    />
    {/* Orb 2: top-right, warm orange */}
    <div
      className="orb orb-2 absolute w-[320px] h-[320px] rounded-full"
      style={{
        top: '-50px',
        right: '-100px',
        background: 'radial-gradient(circle, #ffd6c7 0%, transparent 70%)',
        opacity: 0.16,
        transform: 'translateZ(0)',
      }}
    />
    {/* Orb 3: bottom-left, green */}
    <div
      className="orb orb-3 absolute w-[280px] h-[280px] rounded-full"
      style={{
        bottom: '-100px',
        left: '-100px',
        background: 'radial-gradient(circle, #c7f5e0 0%, transparent 70%)',
        opacity: 0.14,
        transform: 'translateZ(0)',
      }}
    />
    {/* Orb 4: bottom-right, purple */}
    <div
      className="orb orb-4 absolute w-[240px] h-[240px] rounded-full"
      style={{
        bottom: '-50px',
        right: '-50px',
        background: 'radial-gradient(circle, #e8c7ff 0%, transparent 70%)',
        opacity: 0.14,
        transform: 'translateZ(0)',
      }}
    />
  </div>
));

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

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
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AmbientOrbs />
        <div className="relative z-10 min-h-screen" style={{ transform: 'translateZ(0)' }}>
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
