import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Inbox, MessageCircleMore, MessageCircleX, SendHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';
import PageWrapper from '../components/PageWrapper';
import {
  getConversations,
  getThread,
  markThreadAsRead,
} from '../services/api';
import { getSocket } from '../services/socket';

function getAvatarColor(name) {
  const colors = [
    { bg: '#e8f4fd', text: '#1a6fa8' },
    { bg: '#e8fdf4', text: '#1a8a5a' },
    { bg: '#fdf4e8', text: '#a86a1a' },
    { bg: '#f4e8fd', text: '#7a1aa8' },
    { bg: '#fde8e8', text: '#a81a1a' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short'
  });
}

const getConversationKey = (conversation) =>
  `${conversation?.otherUser?._id || ''}_${conversation?.postId?._id || ''}`;

const normalizeId = (value) => String(value?._id || value || '');

const hasConversationsChanged = (prev, next) => {
  if (prev.length !== next.length) return true;

  for (let i = 0; i < next.length; i++) {
    const prevItem = prev[i];
    const nextItem = next[i];

    if (!prevItem || !nextItem) return true;
    if (getConversationKey(prevItem) !== getConversationKey(nextItem)) return true;
    if ((prevItem.unreadCount || 0) !== (nextItem.unreadCount || 0)) return true;
    if ((prevItem.lastMessage?.messageText || '') !== (nextItem.lastMessage?.messageText || '')) return true;
    if ((prevItem.lastMessage?.createdAt || '') !== (nextItem.lastMessage?.createdAt || '')) return true;
  }

  return false;
};

const hasThreadChanged = (prev, next) => {
  if (prev.length !== next.length) return true;
  if (next.length === 0) return false;

  const prevLast = prev[prev.length - 1];
  const nextLast = next[next.length - 1];

  if (!prevLast || !nextLast) return true;
  return String(prevLast._id) !== String(nextLast._id);
};

const isSameDay = (firstDate, secondDate) => {
  const first = new Date(firstDate);
  const second = new Date(secondDate);
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const getDateLabel = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);

  if (isSameDay(now, date)) {
    return 'Today';
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(yesterday, date)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const formatThreadTime = (dateString) =>
  new Date(dateString).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

const messageScrollStyle = {
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
};

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);
  const replyInputRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const typingTimerRef = useRef(null);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null') || {};
    } catch {
      return {};
    }
  }, []);

  const currentUserId = String(currentUser?._id || '');

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  const fetchConversationsData = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoadingConversations(true);
    }

    try {
      const response = await getConversations();
      const incomingConversations = response.data?.data || [];

      setConversations((previous) =>
        hasConversationsChanged(previous, incomingConversations)
          ? incomingConversations
          : previous
      );

      const active = selectedConversationRef.current;
      if (active) {
        const activeKey = getConversationKey(active);
        const refreshedActive = incomingConversations.find(
          (item) => getConversationKey(item) === activeKey
        );

        if (!refreshedActive) {
          setSelectedConversation(null);
          setThreadMessages([]);
          setMobileThreadOpen(false);
        } else {
          setSelectedConversation(refreshedActive);
        }
      }
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.message || 'Failed to fetch conversations');
      }
    } finally {
      if (!silent) {
        setIsLoadingConversations(false);
      }
    }
  }, []);

  const fetchThreadData = useCallback(async (conversation, silent = false) => {
    if (!conversation?.otherUser?._id || !conversation?.postId?._id) {
      return;
    }

    if (!silent) {
      setIsLoadingThread(true);
    }

    try {
      const response = await getThread(conversation.otherUser._id, conversation.postId._id);
      const incomingThread = response.data?.data || [];

      setThreadMessages((previous) =>
        hasThreadChanged(previous, incomingThread)
          ? incomingThread
          : previous
      );

      setConversations((previous) =>
        previous.map((item) =>
          getConversationKey(item) === getConversationKey(conversation)
            ? { ...item, unreadCount: 0 }
            : item
        )
      );

      markThreadAsRead(conversation.otherUser._id, conversation.postId._id).catch(() => {
        // Non-blocking read status sync.
      });
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.message || 'Failed to fetch messages');
      }
    } finally {
      if (!silent) {
        setIsLoadingThread(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchConversationsData();
  }, [fetchConversationsData]);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    fetchThreadData(selectedConversation);
  }, [selectedConversation, fetchThreadData]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg) => {
      const activeConversation = selectedConversationRef.current;
      const senderId = normalizeId(msg?.senderId);
      const receiverId = normalizeId(msg?.receiverId);
      const postId = normalizeId(msg?.postId);

      if (activeConversation) {
        const activeOtherUserId = String(activeConversation.otherUser?._id || '');
        const activePostId = String(activeConversation.postId?._id || '');
        const isActiveConversationMessage =
          activePostId === postId &&
          [senderId, receiverId].includes(currentUserId) &&
          [senderId, receiverId].includes(activeOtherUserId);

        if (isActiveConversationMessage) {
          setThreadMessages((previous) => {
            if (previous.some((item) => String(item._id) === String(msg._id))) {
              return previous;
            }
            return [...previous, msg];
          });
        }
      }

      setConversations((previous) =>
        previous.map((conversation) => {
          const otherUserId = String(conversation.otherUser?._id || '');
          const conversationPostId = String(conversation.postId?._id || '');
          const sameConversation =
            conversationPostId === postId &&
            [senderId, receiverId].includes(otherUserId) &&
            [senderId, receiverId].includes(currentUserId);

          if (!sameConversation) return conversation;

          const isIncoming = senderId !== currentUserId;
          const isActive =
            selectedConversationRef.current &&
            getConversationKey(selectedConversationRef.current) === getConversationKey(conversation);

          return {
            ...conversation,
            lastMessage: {
              messageText: msg.messageText,
              createdAt: msg.createdAt,
              senderId,
            },
            unreadCount: isIncoming && !isActive ? (conversation.unreadCount || 0) + 1 : 0,
          };
        })
      );
    };

    const handleTypingIndicator = ({ userId, typing }) => {
      const activeConversation = selectedConversationRef.current;
      if (!activeConversation) return;
      if (String(userId) !== String(activeConversation.otherUser?._id || '')) return;
      setIsTyping(Boolean(typing));
    };

    const handleReadAck = () => {
      setThreadMessages((previous) =>
        previous.map((message) => ({ ...message, isRead: true }))
      );
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:indicator', handleTypingIndicator);
    socket.on('messages:read-ack', handleReadAck);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing:indicator', handleTypingIndicator);
      socket.off('messages:read-ack', handleReadAck);
    };
  }, [currentUserId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedConversation) return;

    const otherUserId = selectedConversation.otherUser?._id;
    const postId = selectedConversation.postId?._id;

    if (!otherUserId || !postId) return;

    socket.emit('conversation:join', { otherUserId, postId });
    socket.emit('messages:read', { otherUserId, postId });

    return () => {
      socket.emit('conversation:leave', { otherUserId, postId });
      socket.emit('typing:stop', { otherUserId, postId });
    };
  }, [selectedConversation?._id, selectedConversation?.otherUser?._id, selectedConversation?.postId?._id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: isInitialLoad.current ? 'instant' : 'smooth',
        block: 'end',
      });
      isInitialLoad.current = false;
    }
  }, [threadMessages]);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMobileThreadOpen(true);
    setReplyText('');

    setConversations((previous) =>
      previous.map((item) =>
        getConversationKey(item) === getConversationKey(conversation)
          ? { ...item, unreadCount: 0 }
          : item
      )
    );
  };

  const handleReplyInputChange = (event) => {
    setReplyText(event.target.value);

    const element = event.target;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 112)}px`;

    const socket = getSocket();
    if (!socket || !selectedConversation) {
      return;
    }

    socket.emit('typing:start', {
      otherUserId: selectedConversation.otherUser._id,
      postId: selectedConversation.postId._id,
    });

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      socket.emit('typing:stop', {
        otherUserId: selectedConversation.otherUser._id,
        postId: selectedConversation.postId._id,
      });
    }, 1500);
  };

  const handleSendReply = async () => {
    if (!selectedConversation || isSending) {
      return;
    }

    const trimmedText = replyText.trim();
    if (!trimmedText) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      toast.error('Realtime connection unavailable. Please login again.');
      return;
    }

    setReplyText('');
    if (replyInputRef.current) {
      replyInputRef.current.style.height = '44px';
    }

    setIsSending(true);

    try {
      socket.emit('message:send', {
        receiverId: selectedConversation.otherUser._id,
        postId: selectedConversation.postId._id,
        messageText: trimmedText,
      });

      socket.emit('typing:stop', {
        otherUserId: selectedConversation.otherUser._id,
        postId: selectedConversation.postId._id,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleReplyKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendReply();
    }
  };

  const selectedConversationKey = getConversationKey(selectedConversation || {});
  const showListPanelMobile = !mobileThreadOpen;
  const showThreadPanelMobile = mobileThreadOpen;

  return (
    <PageWrapper>
      <div className="container-lg px-4 md:px-6 py-8 md:py-12">
        <motion.h1
          className="text-4xl font-syne font-bold text-ink-primary mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Messages
        </motion.h1>

        <div className="glass rounded-2xl border border-white/80 overflow-hidden shadow-sm h-[78vh] md:h-[72vh]">
          <div className="h-full flex">
            <aside
              className={`${showListPanelMobile ? 'flex' : 'hidden'} md:flex`}
            >
              <div className="w-full md:w-[300px] border-r border-black/5 flex flex-col">
                <div className="px-4 py-4 border-b border-black/5">
                  <p className="text-sm font-dm font-medium text-ink-secondary">Conversations</p>
                </div>

                <div className="flex-1 p-2 space-y-2" style={messageScrollStyle}>
                  {isLoadingConversations ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`conv-skeleton-${index}`}
                        className="rounded-xl border border-white/70 bg-white/60 p-3 animate-pulse"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200" />
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
                            <div className="h-2.5 w-36 bg-slate-200 rounded mb-1" />
                            <div className="h-2.5 w-20 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : conversations.length === 0 ? (
                    <div className="h-full flex items-center justify-center px-4 text-center">
                      <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft mb-3">
                          <Inbox size={24} className="text-accent" />
                        </div>
                        <p className="text-sm font-dm text-ink-primary mb-1">No conversations yet</p>
                        <p className="text-xs font-dm text-ink-muted leading-relaxed">
                          When someone messages you or you contact a post owner,
                          your conversations will appear here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    conversations.map((conversation) => {
                      const isSelected = selectedConversationKey === getConversationKey(conversation);
                      const avatarName = conversation.otherUser?.name || 'User';
                      const avatarColors = getAvatarColor(avatarName);
                      const postTitle = conversation.postId?.title || 'Unknown post';
                      const preview = conversation.lastMessage?.messageText || 'No messages yet';

                      return (
                        <button
                          key={getConversationKey(conversation)}
                          type="button"
                          onClick={() => handleSelectConversation(conversation)}
                          className={`w-full text-left p-3 rounded-xl transition-colors border-l-4 ${
                            isSelected
                              ? 'bg-white/80 border-l-accent shadow-sm'
                              : 'border-l-transparent hover:bg-white/65'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold font-dm"
                              style={{ background: avatarColors.bg, color: avatarColors.text }}
                            >
                              {avatarName.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[0.9rem] font-dm font-semibold text-ink-primary truncate">
                                  {avatarName}
                                </p>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[0.7rem] text-ink-muted font-dm">
                                    {timeAgo(conversation.lastMessage?.createdAt)}
                                  </span>
                                  {conversation.unreadCount > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-accent" />
                                  )}
                                </div>
                              </div>

                              <p className="text-[0.75rem] text-ink-muted truncate font-dm">
                                {postTitle}
                              </p>

                              <p className="text-[0.8rem] text-ink-secondary truncate font-dm mt-0.5">
                                {preview}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>

            <section
              className={`${showThreadPanelMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}
            >
              {!selectedConversation ? (
                <div className="h-full flex items-center justify-center text-center px-6">
                  <div>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft mb-3">
                      <MessageCircleMore size={24} className="text-accent" />
                    </div>
                    <p className="text-base font-dm text-ink-primary">Select a conversation to start chatting</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-black/5 bg-white/55 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="md:hidden text-sm px-2 py-1 rounded-md border border-black/10 text-ink-secondary"
                        onClick={() => setMobileThreadOpen(false)}
                      >
                        <span className="inline-flex items-center gap-1">
                          <ArrowLeft size={14} />
                          <span>Back</span>
                        </span>
                      </button>

                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold font-dm"
                        style={{
                          background: getAvatarColor(selectedConversation.otherUser?.name || 'User').bg,
                          color: getAvatarColor(selectedConversation.otherUser?.name || 'User').text,
                        }}
                      >
                        {(selectedConversation.otherUser?.name || 'U').charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="font-syne font-bold text-ink-primary truncate">
                          {selectedConversation.otherUser?.name || 'Unknown'}
                        </p>
                        <div className="mt-0.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.7rem] font-dm font-medium ${
                              selectedConversation.postId?.type === 'lost'
                                ? 'bg-red-50 text-red-700 border border-red-100'
                                : 'bg-green-50 text-green-700 border border-green-100'
                            }`}
                          >
                            [{String(selectedConversation.postId?.type || '').toUpperCase()}] {selectedConversation.postId?.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-4 py-4 bg-[rgba(255,255,255,0.35)]" style={messageScrollStyle}>
                    {isLoadingThread && threadMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm font-dm text-ink-muted">Loading conversation...</p>
                      </div>
                    ) : threadMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft mb-2">
                            <MessageCircleX size={24} className="text-accent" />
                          </div>
                          <p className="text-sm font-dm text-ink-secondary">No messages in this thread yet</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {threadMessages.map((message, index) => {
                          const previous = index > 0 ? threadMessages[index - 1] : null;
                          const currentSenderId = String(message.senderId?._id || message.senderId || '');
                          const previousSenderId = previous
                            ? String(previous.senderId?._id || previous.senderId || '')
                            : '';
                          const isMine = currentSenderId === currentUserId;
                          const showDate = !previous || !isSameDay(previous.createdAt, message.createdAt);
                          const showSenderName = !isMine && (!previous || previousSenderId !== currentSenderId);

                          return (
                            <React.Fragment key={`${message._id}-${index}`}>
                              {showDate && (
                                <div className="flex items-center gap-3 py-2">
                                  <div className="h-px flex-1 bg-black/10" />
                                  <span className="text-[0.72rem] font-dm text-ink-muted">
                                    {getDateLabel(message.createdAt)}
                                  </span>
                                  <div className="h-px flex-1 bg-black/10" />
                                </div>
                              )}

                              <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className="max-w-[70%]">
                                  {showSenderName && (
                                    <p className="text-[0.7rem] text-ink-muted mb-1 px-1 font-dm">
                                      {message.senderId?.name || selectedConversation.otherUser?.name || 'User'}
                                    </p>
                                  )}

                                  <div
                                    className={`px-4 py-2.5 text-sm font-dm leading-relaxed shadow-sm ${
                                      isMine
                                        ? 'bg-[#0f0f12] text-white'
                                        : 'bg-white/85 text-ink-primary border border-black/10'
                                    } message-bubble`}
                                    style={{
                                      borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    }}
                                  >
                                    {message.messageText}
                                  </div>

                                  <p className={`text-[0.7rem] text-ink-muted mt-1 px-1 font-dm ${isMine ? 'text-right' : 'text-left'}`}>
                                    {formatThreadTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                        {isTyping && (
                          <div
                            className="typing-indicator"
                            style={{
                              padding: '8px 16px',
                              color: 'var(--ink-muted)',
                              fontSize: '0.8rem',
                              fontStyle: 'italic',
                            }}
                          >
                            Typing...
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  <div className="border-t border-black/5 p-3 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-end gap-2">
                      <textarea
                        ref={replyInputRef}
                        value={replyText}
                        onChange={handleReplyInputChange}
                        onKeyDown={handleReplyKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="input min-h-[44px] max-h-[112px] resize-none"
                      />

                      <button
                        type="button"
                        onClick={handleSendReply}
                        disabled={isSending || !replyText.trim()}
                        className="h-[44px] px-4 rounded-full bg-[#0f0f12] text-white text-sm font-dm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          '...'
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <SendHorizontal size={15} />
                            <ArrowRight size={14} />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Messages;
