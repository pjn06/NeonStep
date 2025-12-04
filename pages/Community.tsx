import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { NeonCard, NeonButton } from '../components/NeonUI';
import { Heart, MessageCircle, Send } from 'lucide-react';

export const Community: React.FC = () => {
  const { user, posts, addPost, toggleLike } = useApp();
  const [newContent, setNewContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      addPost(newContent);
      setNewContent('');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold mb-4">광장 <span className="text-sm font-normal text-slate-400 ml-2">함께 성장하는 우리</span></h2>

      {/* Write Post */}
      <NeonCard neonColor="purple" className="mb-6">
        <form onSubmit={handlePost}>
            <div className="flex gap-3">
                <img src={user?.avatar} alt="Me" className="w-10 h-10 rounded-full border border-slate-600" />
                <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="오늘 어떤 작은 성취가 있었나요? 공유해주세요!"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-fuchsia-500 resize-none h-20"
                />
            </div>
            <div className="flex justify-end mt-2">
                <NeonButton type="submit" disabled={!newContent.trim()} className="!py-1.5 !px-4 text-sm !rounded-lg flex items-center gap-2">
                    <Send size={14} /> 게시하기
                </NeonButton>
            </div>
        </form>
      </NeonCard>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
            <div key={post.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-fade-in hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="font-bold text-slate-200">{post.userName}</div>
                        <div className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleTimeString()}</div>
                    </div>
                </div>
                
                <p className="text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                
                <div className="flex gap-2 mb-3">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-slate-800">
                    <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 text-sm transition-colors ${post.likes > 0 ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
                    >
                        <Heart size={18} fill={post.likes > 0 ? "currentColor" : "none"} />
                        <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors">
                        <MessageCircle size={18} />
                        <span>{post.comments}</span>
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};