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
      setSavedName(saved);
      setUserName(saved);
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
    <div className="min-h-screen text-white relative flex items-center justify-center cyber-grid font-mono">
      <div className="relative z-10 text-center max-w-md mx-auto p-6 bg-black/80 backdrop-blur-sm rounded-lg border-2 border-green-500/50 shadow-lg shadow-green-500/10">
        {!savedName ? (
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 uppercase" style={{ textShadow: '0 0 10px #0f0' }}>
              Name Yourself
            </h1>
            <p className="text-green-400/80 mb-8 text-sm">
              Enter your name to proceed.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="CALLNAME"
                className="w-full px-6 py-3 text-lg text-center bg-transparent border-2 border-green-500/50 rounded-md text-green-400 placeholder-green-400/50 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
                maxLength={20}
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full px-8 py-4 bg-green-500/80 hover:bg-green-500 text-black text-lg font-bold rounded-md transition-all duration-300 transform shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userName.trim()}
              >
                   START GAME
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 uppercase" style={{ textShadow: '0 0 10px #0f0' }}>
              Welcome Back !!!
            </h1>
            <p className="text-xl text-green-400/80 mb-8">
              Callname: <span className="font-bold text-green-400">{savedName}</span>
            </p>
            <div className="space-y-4">
              <button
                onClick={() => onNameSubmit(savedName)}
                className="w-full px-8 py-4 bg-green-500/80 hover:bg-green-500 text-black text-lg font-bold rounded-md transition-all duration-300 transform  shadow-lg shadow-green-500/20"
              >
                Continue as {savedName.toUpperCase()}
              </button>
              <button
                onClick={handleChangeName}
                className="w-full px-6 py-3 bg-transparent border-2 border-green-500/50 text-green-400  rounded-md transition-all duration-300"
              >
                Change Callname
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}