import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
const AmbientOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Orb 1: top-left, blue */}
    <div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        top: '-100px',
        left: '-100px',
        background: 'radial-gradient(circle, #c7d7ff 0%, transparent 70%)',
        filter: 'blur(100px)',
        opacity: 0.45,
      }}
    />
    {/* Orb 2: top-right, warm orange */}
    <div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{
        top: '-50px',
        right: '-100px',
        background: 'radial-gradient(circle, #ffd6c7 0%, transparent 70%)',
        filter: 'blur(100px)',
        opacity: 0.35,
      }}
    />
    {/* Orb 3: bottom-left, green */}
    <div
      className="absolute w-[350px] h-[350px] rounded-full"
      style={{
        bottom: '-100px',
        left: '-100px',
        background: 'radial-gradient(circle, #c7f5e0 0%, transparent 70%)',
        filter: 'blur(100px)',
        opacity: 0.3,
      }}
    />
    {/* Orb 4: bottom-right, purple */}
    <div
      className="absolute w-[300px] h-[300px] rounded-full"
      style={{
        bottom: '-50px',
        right: '-50px',
        background: 'radial-gradient(circle, #e8c7ff 0%, transparent 70%)',
        filter: 'blur(100px)',
        opacity: 0.3,
      }}
    />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AmbientOrbs />
        <div className="relative z-10">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
