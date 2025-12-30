'use client';

import { useState, useEffect } from 'react';

interface NameInputProps {
  onNameSubmit: (name: string) => void;
}

export default function NameInput({ onNameSubmit }: NameInputProps) {
  const [userName, setUserName] = useState<string>('');
  const [savedName, setSavedName] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('reactionSpeed_userName');
    if (saved) {
      const timer = setTimeout(() => {
        setSavedName(saved);
        setUserName(saved);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = userName.trim();
    if (trimmedName) {
      localStorage.setItem('reactionSpeed_userName', trimmedName);
      onNameSubmit(trimmedName);
    }
  };

  const handleChangeName = () => {
    setUserName('');
    setSavedName('');
    localStorage.removeItem('reactionSpeed_userName');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-black to-blue-900 relative overflow-hidden flex items-center justify-center">
   
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-6000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/25 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-8000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-6">
        {!savedName ? (
          <div className="animate-float">
            <h1 className="text-4xl font-bold mb-6 animate-rainbow bg-clip-text text-transparent">
              Enter Your Name
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
           Enter your name to get started!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-6 py-4 text-xl font-bold text-center bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-all duration-300 animate-float animation-delay-1000"
                maxLength={20}
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full px-8 py-4 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform shadow-2xl border-2 border-red-400 glow-border animate-float animation-delay-2000 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userName.trim()}
              >
                START GAME
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-float">
            <h1 className="text-4xl font-bold mb-6 animate-rainbow bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Hello, <span className="text-yellow-400 font-bold">{savedName}</span>!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => onNameSubmit(savedName)}
                className="w-full px-8 py-4 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform shadow-2xl border-2 border-red-400 glow-border animate-float"
              >
                CONTINUE AS {savedName.toUpperCase()}
              </button>
              <button
                onClick={handleChangeName}
                className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:border-yellow-400 hover:text-yellow-400 rounded-xl transition-all duration-300 animate-float animation-delay-1000"
              >
                Use Different Name
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


