'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

type GameState = 'preparing' | 'waiting' | 'ready' | 'clicked' | 'tooEarly' | 'levelComplete' | 'gameOver';

interface GameStats {
  currentLevel: number;
  reactionTime: number | null;
  bestTime: number | null;
  levelScore: number;
  totalScore: number;
  lives: number;
}

interface Level {
  id: number;
  name: string;
  minWait: number;
  maxWait: number;
  targetTime: number;
  points: number;
}

const LEVELS: Level[] = [
  { id: 1, name: "Level 1", minWait: 2000, maxWait: 4000, targetTime: 600, points: 10 },
  { id: 2, name: "Level 2", minWait: 1500, maxWait: 3500, targetTime: 550, points: 15 },
  { id: 3, name: "Level 3", minWait: 1200, maxWait: 3000, targetTime: 500, points: 20 },
  { id: 4, name: "Level 4", minWait: 1000, maxWait: 2500, targetTime: 450, points: 30 },
  { id: 5, name: "Level 5", minWait: 800, maxWait: 2000, targetTime: 400, points: 40 },
  { id: 6, name: "Level 6", minWait: 600, maxWait: 1800, targetTime: 300, points: 50 },
  { id: 7, name: "Level 7", minWait: 500, maxWait: 1500, targetTime: 280, points: 75 },
  { id: 8, name: "Level 8", minWait: 400, maxWait: 1200, targetTime: 260, points: 100 },
  { id: 9, name: "Level 9", minWait: 300, maxWait: 1000, targetTime: 240, points: 150 },
  { id: 10, name: "Level 10", minWait: 200, maxWait: 800, targetTime: 220, points: 200 }
];

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [stats, setStats] = useState<GameStats>({
    currentLevel: 1,
    reactionTime: null,
    bestTime: null,
    levelScore: 0,
    totalScore: 0,
    lives: 3
  });
  const [countdown, setCountdown] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [shouldAdvanceLevel, setShouldAdvanceLevel] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const penaltyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  
  useEffect(() => {
    return () => {
      setCountdown(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (penaltyIntervalRef.current) {
        clearInterval(penaltyIntervalRef.current);
        penaltyIntervalRef.current = null;
      }
    };
  }, []);

  const startLevel = useCallback(() => {
    setGameState('waiting');
    setStats(prev => {
      const level = LEVELS[prev.currentLevel - 1];
      const delay = Math.random() * (level.maxWait - level.minWait) + level.minWait;

      setTimeout(() => {
        setStartTime(performance.now());
        setGameState('ready');
      }, delay);

      const newBestTime = prev.reactionTime && (!prev.bestTime || prev.reactionTime < prev.bestTime) 
        ? prev.reactionTime 
        : prev.bestTime;
      
      return {
        ...prev,
        bestTime: newBestTime
      };
    });
  }, []);

  useEffect(() => {
    if (shouldAdvanceLevel && countdown > 0) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              setShouldAdvanceLevel(false);
              setStats(current => {
                if (current.currentLevel < LEVELS.length) {
                  return { ...current, currentLevel: current.currentLevel + 1, levelScore: 0 };
                } else {
                  setGameState('gameOver');
                  return current;
                }
              });
              startLevel();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldAdvanceLevel, countdown, startLevel]);

  const currentLevel = LEVELS[stats.currentLevel - 1];

  const handleClick = useCallback(async () => {
    
    if (gameState === 'levelComplete' || gameState === 'gameOver') {
      return;
    }
    
    if (gameState === 'ready') {
      const endTime = performance.now();
      const reactionTime = endTime - startTime;

      setStats(prev => {
        const level = LEVELS[prev.currentLevel - 1];
        const isSuccess = reactionTime <= level.targetTime;

        if (isSuccess) {
          const points = level.points + Math.max(0, Math.floor((level.targetTime - reactionTime) / 10));
    
          const playerName = localStorage.getItem('reactionSpeed_userName') || 'Anonymous';
          fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName: playerName,
              reactionTime,
              level: prev.currentLevel,
              score: points
            })
          }).catch(error => console.error('Failed to save score:', error));

          fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName })
          }).catch(error => console.error('Failed to save user:', error));

        
          setGameState('levelComplete');
         
          setTimeout(() => {
            setCountdown(3);
            setShouldAdvanceLevel(true);
          }, 2000);

          return {
            ...prev,
            reactionTime,
            bestTime: prev.bestTime ? Math.min(prev.bestTime, reactionTime) : reactionTime,
            levelScore: prev.levelScore + points,
            totalScore: prev.totalScore + points
          };
        } else {
        
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          } else {
            setGameState('clicked');
            setCountdown(5);
            if (!penaltyIntervalRef.current) {
              penaltyIntervalRef.current = setInterval(() => {
                setCountdown(prevCount => {
                  if (prevCount <= 1) {
                    if (penaltyIntervalRef.current) clearInterval(penaltyIntervalRef.current);
                    penaltyIntervalRef.current = null;
                    setTimeout(() => startLevel(), 500);
                    return 0;
                  }
                  return prevCount - 1;
                });
              }, 1000);
            }
          }
          return { ...prev, lives: newLives };
        }
      });
    } else if (gameState === 'waiting') {
      setGameState('tooEarly');
      setCountdown(3);
      const penaltyInterval = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(penaltyInterval);
            setTimeout(() => startLevel(), 500);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  }, [gameState, startTime, startLevel]);

  const resetGame = () => {
    setGameStarted(false);
    setShouldAdvanceLevel(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStats({
      currentLevel: 1,
      reactionTime: null,
      bestTime: null,
      levelScore: 0,
      totalScore: 0,
      lives: 3
    });
    setGameState('waiting');
    setCountdown(0);
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'preparing': return 'bg-blue-600';
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      case 'tooEarly': return 'bg-yellow-500';
      case 'levelComplete': return countdown > 0 ? 'bg-blue-600' : 'bg-green-500';
      case 'gameOver': return 'bg-gray-700';
      default: return 'bg-gray-400';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'preparing': return `${countdown}`;
      case 'waiting': return 'WAIT';
      case 'ready': return 'CLICK!';
      case 'clicked': return countdown > 0 ? `PENALTY: ${countdown}` : 'TOO SLOW! TRY AGAIN';
      case 'tooEarly': return countdown > 0 ? `PENALTY: ${countdown}` : 'TOO EARLY!';
      case 'levelComplete': 
        if (countdown > 0) {
          return `LOADING LEVEL ${stats.currentLevel + 1}...${countdown}`;
        } else {
          return stats.currentLevel >= LEVELS.length ? '🏆 CHAMPION!' : `LEVEL ${stats.currentLevel} COMPLETE!`;
        }
      case 'gameOver': return stats.lives <= 0 ? '💀 GAME OVER' : '🏆 ALL LEVELS COMPLETE!';
      default: return 'READY?';
    }
  };

  const getMessageClass = () => {
    if (gameState === 'levelComplete') {
      if (countdown > 0) {
        return 'text-6xl font-black mb-4 animate-bounce text-yellow-300';
      } else {
        return 'text-5xl font-black mb-4 animate-pulse text-green-300 bg-green-500/20 px-6 py-3 rounded-2xl';
      }
    }
    return 'text-6xl font-black mb-4 animate-pulse';
  };

  const getReactionDisplay = () => {
    if (gameState === 'levelComplete' && countdown === 0 && stats.reactionTime) {
      const level = LEVELS[stats.currentLevel - 1];
      const isSuccess = stats.reactionTime <= level.targetTime;
      const points = Math.floor(level.points + Math.max(0, Math.floor((level.targetTime - stats.reactionTime) / 10)));
      
      return (
        <div className="text-center animate-bounce">
          <div className={`text-7xl font-black mb-2 ${isSuccess ? 'text-green-400 animate-pulse' : 'text-red-400 animate-pulse'}`}>
            {stats.reactionTime.toFixed(0)}ms
          </div>
          <div className="text-xl text-white font-bold">
            Target: {level.targetTime}ms
          </div>
          <div className={`text-lg font-bold ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>
            {isSuccess ? `EXCELLENT! +${points} POINTS!` : 'TOO SLOW!'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
                    <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        
        <div className="flex justify-between items-center p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-white font-bold text-xl">LEVEL {stats.currentLevel}</span>
          </Link>
          <div className="flex items-center space-x-6 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.totalScore}</div>
              <div className="text-xs text-gray-400">SCORE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{'❤️'.repeat(stats.lives)}</div>
              <div className="text-xs text-gray-400">LIVES</div>
            </div>
          </div>
        </div>

        
        <div className="text-center px-4 py-4">
          <h2 className="text-3xl font-bold text-white mb-2">{currentLevel.name}</h2>
          <div className="text-sm text-gray-400">
            Target: {currentLevel.targetTime}ms
          </div>
        </div>

       
        <div className="flex justify-center px-4 py-8">
          <div
            className={`w-full max-w-2xl h-96 rounded-2xl ${getBackgroundColor()} cursor-pointer flex flex-col items-center justify-center text-white transition-all duration-150 shadow-2xl hover:scale-101 active:scale-98 border-4 border-white/20`}
            onClick={handleClick}
          >
            <div className={getMessageClass()}>{getMessage()}</div>
            {getReactionDisplay()}
          </div>
        </div>

      
        <div className="flex justify-center px-4 mb-8">
          {stats.currentLevel === 1 && gameState === 'waiting' && countdown === 0 && !gameStarted && (
            <button
              onClick={() => { setGameStarted(true); startLevel(); }}
              className="px-12 py-6 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-red-400 glow-border animate-float"
            >
              START LEVEL 1
            </button>
          )}
          {gameState === 'gameOver' && (
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">
                {stats.lives <= 0 ? '💀 GAME OVER' : '🏆 ALL LEVELS COMPLETE!'}
              </div>
              <div className="text-2xl text-yellow-400 mb-6 font-bold">Final Score: {stats.totalScore}</div>
              <button
                onClick={resetGame}
                className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-green-400"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>

        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
          >
            ← EXIT GAME
          </Link>
        </div>
      </div>
    </div>
  );
}