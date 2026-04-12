import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { messageAPI } from '../services/api';

const MessageBox = ({ postId, recipientId }) => {
  const sessionKey = useMemo(
    () => `lnf_msg_sent_${postId}_${recipientId}`,
    [postId, recipientId]
  );

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadySent, setAlreadySent] = useState(() => {
    return sessionStorage.getItem(sessionKey) === 'true';
  });

  const showSuccessState = isSuccess || alreadySent;

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);

    try {
      await messageAPI.sendMessage({
        receiverId: recipientId,
        postId,
        messageText: trimmedMessage,
      });

      sessionStorage.setItem(sessionKey, 'true');
      setIsSuccess(true);
      setAlreadySent(true);
      setMessageText('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <h3 className="font-syne font-bold text-ink-primary">Send a Message</h3>

      {showSuccessState ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
          <p className="text-sm font-dm font-medium text-emerald-700">
            {isSuccess
              ? '✓ Message sent! Go to Messages to continue the conversation.'
              : "You've already sent a message. View conversation →"}
          </p>
          <Link
            to="/messages"
            className="inline-flex items-center mt-3 text-sm font-dm font-medium text-emerald-700 hover:underline"
          >
            View Conversation →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="input-wrapper">
            <div className="relative">
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="input"
                disabled={isSending}
              />
              <label className="input-label">Message</label>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSending || !messageText.trim()}
            className={`btn btn-primary w-full ${isSending ? 'btn-loading' : ''}`}
            whileHover={{ scale: isSending ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default MessageBox;
