'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Arsenal, Exo_2 } from 'next/font/google';
import { RSC_ACTION_CLIENT_WRAPPER_ALIAS } from 'next/dist/lib/constants';
import { markAsUntransferable } from 'worker_threads';
import { waitForDebugger } from 'inspector';
import { projectEntrypointsSubscribe } from 'next/dist/build/swc/generated-native';

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
  { id: 1, name: "Level 1", minWait: 2000, maxWait: 4000, targetTime: 800, points: 20 },
  { id: 2, name: "Level 2", minWait: 1200, maxWait: 3000, targetTime: 600, points: 50 },
  { id: 3, name: "Level 3", minWait: 800, maxWait: 2200, targetTime: 400, points: 100 },
  { id: 4, name: "Level 4", minWait: 500, maxWait: 1500, targetTime: 250, points: 200 },
  { id: 5, name: "Level 5", minWait: 300, maxWait: 1000, targetTime: 180, points: 350 }
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
  const [completedLevel, setCompletedLevel] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const penaltyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef<boolean>(false);
  const waitingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
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
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
    waitingTimeoutRef.current = null;
      }
    };
  }, []);

  const startLevel = useCallback(() => {
    
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
    
    setGameState('waiting');
    setStats(prev => {
      const level = LEVELS[prev.currentLevel - 1];
   const delay = Math.random() * (level.maxWait - level.minWait) + level.minWait;

      waitingTimeoutRef.current = setTimeout(() => {
   setStartTime(performance.now());
        setGameState('ready');
        waitingTimeoutRef.current = null;
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
            
           
  setTimeout(() => {
      setStats(current => {
           const newLevel = current.currentLevel + 1;
                  if (newLevel <= LEVELS.length && current.currentLevel === stats.currentLevel) {
               setTimeout(() => {
                 startLevel();
                }, 50);
                    return { ...current, currentLevel: newLevel, levelScore: 0 };
                  } else if (newLevel > LEVELS.length) {
                    setGameState('gameOver');
                    return current;
                  } else {
                    return current;
                  }
                });
            }, 50);
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
    if (gameState === 'levelComplete' || gameState === 'gameOver' || processingRef.current) {
      return;
    }
    
    if (gameState === 'ready') {
      processingRef.current = true;
      const endTime = performance.now();
      const reactionTime = endTime - startTime;

      setStats(prev => {
        const level = LEVELS[prev.currentLevel - 1];
       
        
        const graceTime = reactionTime < 150 ? level.targetTime + 250 : level.targetTime + 50;
        const isSuccess = reactionTime <= graceTime;

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

          setCompletedLevel(prev.currentLevel);
       setGameState('levelComplete');
          setTimeout(() => {
            setCountdown(3);
      setShouldAdvanceLevel(true);
          }, 2500);
          
          setTimeout(() => {
            setIsProcessing(false);
            processingRef.current = false;
          }, 5500);

          return {
        ...prev,
            reactionTime,
            bestTime: prev.bestTime ? Math.min(prev.bestTime, reactionTime) : reactionTime,
        levelScore: prev.levelScore + points,
            totalScore: prev.totalScore + points
          };
        } else {
          setIsProcessing(false);
          processingRef.current = false;
          const newLives = Math.max(0, prev.lives - 1);
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
  }, [gameState, startTime, startLevel, isProcessing]);

  const resetGame = () => {
    setGameStarted(false);
    setShouldAdvanceLevel(false);
    setCompletedLevel(0);
    setIsProcessing(false);
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
      case 'levelComplete': return countdown > 0 ? 'bg-gradient-to-br from-purple-600 to-blue-700' : 'bg-gradient-to-br from-green-500 to-emerald-600';
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
          
          const nextLevel = stats.currentLevel < LEVELS.length ? stats.currentLevel + 1 : stats.currentLevel;
          return `NEXT: LEVEL ${nextLevel} IN ${countdown}`;
        } else {
         
          return completedLevel >= LEVELS.length ? '🏆 ALL COMPLETE!' : `✅ LEVEL ${completedLevel} CLEARED!`;
        }
      case 'gameOver': return stats.lives <= 0 ? '💀 GAME OVER' : '🏆 ALL LEVELS COMPLETE!';
      default: return 'READY?';
    }
  };

  const getMessageClass = () => {
    if (gameState === 'levelComplete') {
      if (countdown > 0) {
        return 'text-7xl md:text-8xl font-black mb-8 animate-pulse text-white';
      } else {
        return 'text-7xl md:text-8xl font-black mb-8 animate-bounce text-white';
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
        <div className="text-center">
          <div className={`text-9xl md:text-[12rem] font-black mb-6 text-white animate-pulse`}>
            {stats.reactionTime.toFixed(0)}ms
          </div>
          <div className="text-3xl md:text-4xl text-white/80 font-bold mb-4">
            Target: {level.targetTime}ms
          </div>
          <div className={`text-4xl md:text-5xl font-black text-white`}>
            {isSuccess ? `PERFECT ! +${points} POINTS!` : '❌ TOO SLOW!'}
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
              <div className="text-2xl font-bold text-red-400">{'❤️'.repeat(Math.max(0, stats.lives))}</div>
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

       
        {gameState === 'levelComplete' ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-green-500 to-emerald-600">
            <div className="text-center">
              <div className={getMessageClass()}>{getMessage()}</div>
              {getReactionDisplay()}
            </div>
          </div>
        ) : (
          <div className="flex justify-center px-4 py-8">
            <div
              className={`w-full max-w-2xl h-96 rounded-2xl ${getBackgroundColor()} cursor-pointer flex flex-col items-center justify-center text-white transition-all duration-150 shadow-2xl hover:scale-101 active:scale-98 border-4 border-white/20`}
              onClick={handleClick}
            >
              <div className={getMessageClass()}>{getMessage()}</div>
              {getReactionDisplay()}
            </div>
          </div>
        )}

      
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-black">
              <div className="text-center max-w-2xl px-8">
                {stats.lives <= 0 ? (
                  <>
                    <div className="text-9xl mb-8 animate-pulse">💀</div>
                    <div className="text-7xl md:text-8xl font-black text-white mb-8 animate-bounce">
                      GAME OVER
                    </div>
                    <div className="text-3xl text-red-400 mb-4 font-bold">Better Luck Next Time!</div>
                  </>
                ) : (
                  <>
                    <div className="text-7xl mb-8 animate-bounce">🏆</div>
                    <div className="text-7xl md:text-8xl font-black bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-8 animate-pulse">
                      VICTORY!
                    </div>
                    <div className="text-4xl text-green-400 mb-4 font-bold">All Levels Conquered!</div>
                  </>
                )}
                <div className="my-12 p-8 bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20">
                  <div className="text-2xl text-white/80 mb-2">Final Score</div>
                  <div className="text-8xl font-black text-yellow-400 animate-pulse">{stats.totalScore}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                  <button
                    onClick={resetGame}
                    className="px-16 py-6 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-black rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-green-400"
                  >
                    PLAY AGAIN
                  </button>
                  <Link
                    href="/"
                    className="px-16 py-6 bg-white/10 hover:bg-white/20 text-white text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30"
                  >
                   HOME
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {gameState !== 'gameOver' && (
          <div className="text-center pb-8">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}