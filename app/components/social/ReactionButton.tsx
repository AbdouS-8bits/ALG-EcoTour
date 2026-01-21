'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, ThumbsUp, Star, Laugh, Frown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionButtonProps {
  tourId: string;
  initialReactions?: {
    likes: number;
    loves: number;
    stars: number;
    wow: number;
    haha: number;
  };
  userReaction?: 'like' | 'love' | 'star' | 'wow' | 'haha' | null;
  className?: string;
}

interface Reaction {
  type: 'like' | 'love' | 'star' | 'wow' | 'haha';
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const reactionTypes: Reaction[] = [
  { 
    type: 'like', 
    icon: ThumbsUp, 
    label: 'أعجبني', 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    hoverColor: 'hover:bg-blue-200'
  },
  { 
    type: 'love', 
    icon: Heart, 
    label: 'أحببته', 
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    hoverColor: 'hover:bg-red-200'
  },
  { 
    type: 'star', 
    icon: Star, 
    label: 'رائع', 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    hoverColor: 'hover:bg-yellow-200'
  },
  { 
    type: 'wow', 
    icon: Frown, 
    label: 'مدهش', 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    hoverColor: 'hover:bg-purple-200'
  },
  { 
    type: 'haha', 
    icon: Laugh, 
    label: 'مضحك', 
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    hoverColor: 'hover:bg-green-200'
  }
];

export default function ReactionButton({ 
  tourId, 
  initialReactions = { likes: 0, loves: 0, stars: 0, wow: 0, haha: 0 },
  userReaction = null,
  className = ""
}: ReactionButtonProps) {
  const { data: session } = useSession();
  const [reactions, setReactions] = useState(initialReactions);
  const [myReaction, setMyReaction] = useState(userReaction);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleReact = async (type: Reaction['type']) => {
    if (!session) return;
    
    setIsAnimating(true);
    
    // Simulate API call
    setTimeout(() => {
      const previousReaction = myReaction;
      
      if (previousReaction === type) {
        // Remove reaction
        setReactions(prev => ({
          ...prev,
          [`${type}s`]: prev[`${type}s` as keyof typeof prev] - 1
        }));
        setMyReaction(null);
      } else {
        // Remove previous reaction and add new one
        if (previousReaction) {
          setReactions(prev => ({
            ...prev,
            [`${previousReaction}s`]: prev[`${previousReaction}s` as keyof typeof prev] - 1
          }));
        }
        
        setReactions(prev => ({
          ...prev,
          [`${type}s`]: prev[`${type}s` as keyof typeof prev] + 1
        }));
        setMyReaction(type);
      }
      
      setIsAnimating(false);
      setShowEmojiPicker(false);
    }, 300);
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  const currentReaction = reactionTypes.find((r: Reaction) => r.type === myReaction);

  return (
    <div className={`relative ${className}`}>
      {/* Main Reaction Button */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => session && setShowEmojiPicker(!showEmojiPicker)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
            ${myReaction 
              ? `${currentReaction?.bgColor} ${currentReaction?.color} border-current` 
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
            }
          `}
        >
          {myReaction ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {currentReaction && <currentReaction.icon className="w-5 h-5 fill-current" />}
            </motion.div>
          ) : (
            <Heart className="w-5 h-5" />
          )}
          
          <span className="font-medium">
            {totalReactions > 0 ? totalReactions : 'تفاعل'}
          </span>
        </motion.button>

        {/* Reaction Labels */}
        {totalReactions > 0 && (
          <div className="flex items-center gap-1">
            {reactionTypes.slice(0, 3).map((reaction: Reaction) => (
              reactions[`${reaction.type}s` as keyof typeof reactions] > 0 && (
                <motion.div
                  key={reaction.type}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`w-6 h-6 ${reaction.bgColor} rounded-full flex items-center justify-center`}
                >
                  <reaction.icon className="w-3 h-3" />
                </motion.div>
              )
            ))}
            {totalReactions > 3 && (
              <span className="text-xs text-gray-500">+{totalReactions - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowEmojiPicker(false)}
            />
            
            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.2 }}
              className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50"
            >
              <div className="flex gap-1">
                {reactionTypes.map((reaction: Reaction) => {
                  const count = reactions[`${reaction.type}s` as keyof typeof reactions];
                  const isActive = myReaction === reaction.type;
                  
                  return (
                    <motion.button
                      key={reaction.type}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReact(reaction.type)}
                      disabled={isAnimating}
                      className={`
                        relative flex flex-col items-center p-3 rounded-xl transition-all
                        ${isActive 
                          ? `${reaction.bgColor} ${reaction.color}` 
                          : `${reaction.hoverColor} text-gray-600`
                        }
                        ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <reaction.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                      <span className="text-xs mt-1 font-medium">
                        {count > 0 && count}
                      </span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {reaction.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Animation */}
      {isAnimating && myReaction && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -50, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
        >
          {currentReaction && <currentReaction.icon className="w-8 h-8" />}
        </motion.div>
      )}

      {/* Login Prompt */}
      {!session && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-full mb-2 left-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
        >
          سجل دخولك للتفاعل
        </motion.div>
      )}
    </div>
  );
}
