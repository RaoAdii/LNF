import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { messageAPI } from '../services/api';
import { toast } from 'react-toastify';

const MessageBox = ({ postId, recipientId, onSent }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);

    try {
      await messageAPI.sendMessage({
        receiverId: recipientId,
        postId,
        messageText: message,
      });

      toast.success('Message sent!');
      setMessage('');
      if (onSent) onSent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="space-y-4">
      <h3 className="font-syne font-bold text-ink-primary mb-4">Send a Message</h3>
      
      <div className="input-wrapper">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows="4"
          className="input"
          disabled={isLoading}
        />
        <label className="input-label">Message</label>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        className={`btn btn-primary w-full ${isLoading ? 'btn-loading' : ''}`}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </motion.button>
    </form>
  );
};

export default MessageBox;
