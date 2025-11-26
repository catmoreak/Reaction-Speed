'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type GameState = 'waiting' | 'ready' | 'clicked' | 'tooEarly' | 'idle';

interface GameStats {
  currentRound: number;
  reactionTime: number | null;
  bestTime: number | null;
  averageTime: number | null;
  totalRounds: number;
  times: number[];
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [stats, setStats] = useState<GameStats>({
    currentRound: 0,
    reactionTime: null,
    bestTime: null,
    averageTime: null,
    totalRounds: 0,
    times: []
  });

  const startGame = useCallback(() => {
    setGameState('waiting');
    setStats(prev => ({ ...prev, reactionTime: null }));

    const delay = Math.random() * 4000 + 1000; 

    setTimeout(() => {
      setStartTime(performance.now());
      setGameState('ready');
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === 'ready') {
      const endTime = performance.now();
      const reactionTime = endTime - startTime;

      setStats(prev => {
        const newTimes = [...prev.times, reactionTime];
        const bestTime = prev.bestTime ? Math.min(prev.bestTime, reactionTime) : reactionTime;
        const averageTime = newTimes.reduce((sum, time) => sum + time, 0) / newTimes.length;

        return {
          ...prev,
          reactionTime,
          bestTime,
          averageTime,
          totalRounds: prev.totalRounds + 1,
          currentRound: prev.currentRound + 1,
          times: newTimes
        };
      });

      setGameState('clicked');
    } else if (gameState === 'waiting') {
      setGameState('tooEarly');
      setTimeout(() => setGameState('idle'), 2000);
    }
  }, [gameState, startTime]);

  const resetStats = () => {
    setStats({
      currentRound: 0,
      reactionTime: null,
      bestTime: null,
      averageTime: null,
      totalRounds: 0,
      times: []
    });
    setGameState('idle');
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      case 'tooEarly': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting': return 'Wait for green...';
      case 'ready': return 'CLICK NOW!';
      case 'clicked': return `${stats.reactionTime?.toFixed(0)}ms`;
      case 'tooEarly': return 'Too early! Wait for green.';
      default: return 'Click "Start Round" to begin';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
       
        <nav className="flex justify-between items-center p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <span className="text-white font-bold text-xl">ReactionSpeed</span>
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <button
              onClick={resetStats}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Reset Stats
            </button>
          </div>
        </nav>

       
        <div className="text-center px-4 py-8">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Reaction Speed Game
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Test your reflexes! Click as fast as possible when the screen turns green.
          </p>
        </div>

        
        <div className="flex justify-center px-4 mb-8">
          <div
            className={`w-full max-w-2xl h-96 rounded-3xl ${getBackgroundColor()} cursor-pointer flex items-center justify-center text-white text-4xl font-bold transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95`}
            onClick={handleClick}
          >
            {getMessage()}
          </div>
        </div>

        
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Statistics</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-green-400 mb-2">
                  {stats.reactionTime ? `${stats.reactionTime.toFixed(0)}ms` : '--'}
                </div>
                <div className="text-white font-semibold mb-1">Last Time</div>
                <div className="text-slate-400 text-sm">Your previous attempt</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400 mb-2">
                  {stats.bestTime ? `${stats.bestTime.toFixed(0)}ms` : '--'}
                </div>
                <div className="text-white font-semibold mb-1">Best Time</div>
                <div className="text-slate-400 text-sm">Your personal record</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400 mb-2">
                  {stats.averageTime ? `${stats.averageTime.toFixed(0)}ms` : '--'}
                </div>
                <div className="text-white font-semibold mb-1">Average</div>
                <div className="text-slate-400 text-sm">Across all attempts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-400 mb-2">{stats.totalRounds}</div>
                <div className="text-white font-semibold mb-1">Total Rounds</div>
                <div className="text-slate-400 text-sm">Games played</div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-12">
          <button
            onClick={startGame}
            disabled={gameState === 'waiting' || gameState === 'ready'}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25"
          >
            {gameState === 'idle' || gameState === 'clicked' || gameState === 'tooEarly' ? '🎮 Start Round' : '⏳ Wait...'}
          </button>
          <button
            onClick={resetStats}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105"
          >
           Reset Stats
          </button>
        </div>

        
        <div className="max-w-2xl mx-auto px-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 text-center">How to Play</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start space-x-3">
                <span className="text-red-400 font-bold">1.</span>
                <span>Click "Start Round" and wait for the screen to turn red</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400 font-bold">2.</span>
                <span>When it turns green, click as fast as humanly possible!</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span>View your reaction time and keep practicing to improve</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
