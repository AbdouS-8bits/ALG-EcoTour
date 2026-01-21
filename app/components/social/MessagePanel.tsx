'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, MessageSquare, X, Minimize2, Maximize2, Bell, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  isFromAdmin: boolean;
  isRead: boolean;
  attachments?: string[];
}

interface MessagePanelProps {
  userId?: string;
  className?: string;
}

export default function MessagePanel({ userId, className = "" }: MessagePanelProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate initial messages
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'admin1',
        senderName: 'فريق الدعم',
        senderEmail: 'support@algecotour.dz',
        content: 'مرحباً! كيف يمكننا مساعدتك اليوم؟',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isFromAdmin: true,
        isRead: true,
      },
      {
        id: '2',
        senderId: userId || 'user1',
        senderName: session?.user?.name || 'مستخدم',
        senderEmail: session?.user?.email || 'user@example.com',
        content: 'أود الاستفسار عن رحلة الصحراء',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        isFromAdmin: false,
        isRead: true,
      },
      {
        id: '3',
        senderId: 'admin1',
        senderName: 'فريق الدعم',
        senderEmail: 'support@algecotour.dz',
        content: 'بالتأكيد! رحلة الصحراء هي واحدة من أفضل رحلاتنا. متى تخطط للسفر؟',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        isFromAdmin: true,
        isRead: false,
      }
    ];
    
    setMessages(mockMessages);
    setUnreadCount(mockMessages.filter(m => !m.isRead && m.isFromAdmin).length);
  }, [userId, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicator
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Simulate admin response
          const adminResponse: Message = {
            id: Date.now().toString(),
            senderId: 'admin1',
            senderName: 'فريق الدعم',
            senderEmail: 'support@algecotour.dz',
            content: 'شكراً لرسالتك. سأرد عليك في أقرب وقت ممكن!',
            createdAt: new Date().toISOString(),
            isFromAdmin: true,
            isRead: false,
          };
          setMessages(prev => [...prev, adminResponse]);
          setUnreadCount(prev => prev + 1);
        }, 2000);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: session.user.id,
        senderName: session.user.name || 'مستخدم',
        senderEmail: session.user.email || '',
        content: newMessage,
        createdAt: new Date().toISOString(),
        isFromAdmin: false,
        isRead: true,
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setIsSubmitting(false);
    }, 500);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-DZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Message Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 ${className}`}
        >
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </motion.div>
          )}
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Message Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 ${isMinimized ? 'h-14' : 'h-[500px]'} flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-t-2xl flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <h3 className="font-bold">الرسائل</h3>
                  <p className="text-xs opacity-90">فريق الدعم</p>
                </div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          message.isFromAdmin
                            ? 'bg-white border border-gray-200 text-gray-900'
                            : 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                        }`}
                        onClick={() => message.isFromAdmin && !message.isRead && markAsRead(message.id)}
                      >
                        {/* Admin Info */}
                        {message.isFromAdmin && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Bell className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium">{message.senderName}</span>
                            {!message.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        )}

                        {/* Message Content */}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Time and Read Status */}
                        <div className={`flex items-center justify-between mt-1 text-xs ${message.isFromAdmin ? 'text-gray-500' : 'text-white/70'}`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {!message.isFromAdmin && (
                            <div className="flex items-center gap-1">
                              {message.isRead ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isSubmitting || !newMessage.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? '...' : 'إرسال'}
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    عادة ما نرد خلال دقائق
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
