import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { messageAPI } from '../services/api';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import { SkeletonPostList } from '../components/Skeleton';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response =
        activeTab === 'inbox'
          ? await messageAPI.getInbox()
          : await messageAPI.getSentMessages();

      setMessages(response.data.data || []);
      setSelectedMessage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container-lg px-6 py-12">
        {/* Header */}
        <motion.h1
          className="text-4xl font-syne font-bold text-ink-primary mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Messages
        </motion.h1>

        {/* Tabs */}
        <motion.div
          className="tabs mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab('inbox')}
            className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
          >
            📬 Inbox
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          >
            📤 Sent
          </button>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <SkeletonPostList count={4} />
        ) : messages.length === 0 ? (
          <motion.div
            className="text-center py-16 card card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">
              {activeTab === 'inbox' ? '📭' : '📤'}
            </div>
            <h2 className="text-2xl font-syne font-bold text-ink-primary mb-2">
              {activeTab === 'inbox' ? 'No messages' : 'No sent messages'}
            </h2>
            <p className="text-ink-secondary">
              {activeTab === 'inbox'
                ? 'You have no messages in your inbox'
                : 'You haven\'t sent any messages yet'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {messages.map((message, index) => {
              const displayName =
                activeTab === 'inbox'
                  ? message.senderId?.name || 'Unknown'
                  : message.receiverId?.name || 'Unknown';

              const displayEmail =
                activeTab === 'inbox'
                  ? message.senderId?.email || ''
                  : message.receiverId?.email || '';

              const displayAvatar =
                displayName.charAt(0).toUpperCase();

              return (
                <motion.button
                  key={message._id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full card card-glass flex items-center gap-4 p-4 text-left transition-all group ${
                    selectedMessage?._id === message._id
                      ? 'ring-2 ring-accent'
                      : 'hover:shadow-md'
                  }`}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                    {displayAvatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-dm font-medium text-ink-primary truncate">
                      {displayName}
                    </h3>
                    <p className="text-sm text-ink-muted truncate mb-1">
                      {displayEmail}
                    </p>
                    <p className="text-sm text-ink-secondary truncate max-w-md">
                      {message.content}
                    </p>
                  </div>

                  {/* Timestamp & Unread */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs text-ink-muted">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    {!message.isRead && activeTab === 'inbox' && (
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <motion.div
            className="modal-backdrop z-50"
            onClick={() => setSelectedMessage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                  {(activeTab === 'inbox'
                    ? selectedMessage.senderId?.name
                    : selectedMessage.receiverId?.name
                  )
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-dm font-medium text-ink-primary">
                    {activeTab === 'inbox'
                      ? selectedMessage.senderId?.name
                      : selectedMessage.receiverId?.name}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="divider" />

              <p className="text-ink-secondary font-dm leading-relaxed mb-6">
                {selectedMessage.content}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1 btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Messages;
