'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Send, User, Heart, Flag, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  tourId: string;
  tourTitle: string;
}

export default function CommentSection({ tourId, tourTitle }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments([
        {
          id: '1',
          userId: 'user1',
          userName: 'أحمد محمد',
          userEmail: 'ahmed@example.com',
          content: 'رحلة رائعة جداً! المناظر الطبيعية خلابة والتنظيم ممتاز. أنصح بشدة بزيارة هذه المنطقة.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likes: 12,
          isLiked: false,
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'فاطمة علي',
          userEmail: 'fatima@example.com',
          content: 'تجربة لا تُنسى. الدليل السياحي كان محترفاً جداً وأجاب على جميع استفساراتنا. سأعود مرة أخرى بالتأكيد.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          likes: 8,
          isLiked: true,
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: session.user.id,
        userName: session.user.name || 'مستخدم',
        userEmail: session.user.email || '',
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked 
          }
        : comment
    ));
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim() || !session) return;

    const reply: Comment = {
      id: Date.now().toString(),
      userId: session.user.id,
      userName: session.user.name || 'مستخدم',
      userEmail: session.user.email || '',
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));

    setReplyingTo(null);
    setReplyContent('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg mb-6 w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
        <div className="flex items-center gap-3 text-white">
          <MessageCircle className="w-6 h-6" />
          <h2 className="text-2xl font-bold">التعليقات</h2>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {comments.length} تعليق
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Comment Form */}
        {session ? (
          <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {(session.user.name || 'مستخدم')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`شارك رأيك في ${tourTitle}...`}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">
                    {newComment.length}/500 حرف
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <p className="text-blue-800 font-medium">يجب تسجيل الدخول للمشاركة في التعليقات</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد تعليقات بعد</p>
              <p className="text-gray-400">كن أول من يشارك رأيه في هذه الرحلة</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {comment.userName[0].toUpperCase()}
                    </div>
                    
                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{comment.userName}</h4>
                          <p className="text-sm text-gray-500">{comment.userEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('ar-DZ')}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {comment.content}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                            comment.isLiked 
                              ? 'bg-red-100 text-red-600' 
                              : 'text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleReply(comment.id)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          رد
                        </button>
                        
                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex gap-3">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="اكتب ردك..."
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={() => handleSubmitReply(comment.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                رد
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {reply.userName[0].toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900 text-sm">{reply.userName}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString('ar-DZ')}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
