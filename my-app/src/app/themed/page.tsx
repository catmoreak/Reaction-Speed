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
  { id: 1, name: "Level 1", minWait: 2000, maxWait: 4000, targetTime: 800, points: 20 },
  { id: 2, name: "Level 2", minWait: 1200, maxWait: 3000, targetTime: 600, points: 50 },
  { id: 3, name: "Level 3", minWait: 800, maxWait: 2200, targetTime: 400, points: 100 },
  { id: 4, name: "Level 4", minWait: 500, maxWait: 1500, targetTime: 250, points: 200 },
  { id: 5, name: "Level 5", minWait: 300, maxWait: 1000, targetTime: 180, points: 350 }
];

export default function ThemedGame() {
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

    setCountdown(0);
    setShouldAdvanceLevel(false);
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
          }, 5000);

          setTimeout(() => {
            setIsProcessing(false);
            processingRef.current = false;
          }, 8000);

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
          return `NEXT LEVEL ${nextLevel} IN ${countdown}`;
        } else {
          return '';
        }
      case 'gameOver': return 'GAME OVER';
      default: return '';
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-4000"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
        </div>

        <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-pink-400 to-blue-400 mb-6 leading-tight animate-pulse">
            Cyber Reaction
            <span className="block text-white drop-shadow-lg">
              Challenge
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Test your reflexes in this neon cyberpunk reaction game. Click when the signal turns green!
          </p>

          <button
            onClick={() => {
              setGameStarted(true);
              setTimeout(() => startLevel(), 500);
            }}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-pink-500 hover:from-green-500 hover:to-pink-600 text-black text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-green-400/50 inline-block animate-bounce"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getBackgroundColor()} relative overflow-hidden transition-all duration-300`}>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-4000"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
      </div>

      <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="absolute top-4 left-4 flex items-center space-x-4 text-white">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-400/30">
            <span className="text-green-400 font-bold">LEVEL {stats.currentLevel}</span>
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-pink-400/30">
            <span className="text-pink-400 font-bold">SCORE {stats.totalScore}</span>
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-400/30">
            <span className="text-blue-400 font-bold">LIVES {stats.lives}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-gray-500"
          >
            Reset
          </button>
        </div>

        <div className="text-center">
          <div className="text-8xl md:text-9xl font-black text-white mb-8 drop-shadow-2xl animate-pulse">
            {getMessage()}
          </div>

          {stats.reactionTime && gameState !== 'waiting' && gameState !== 'ready' && (
            <div className="mb-8">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.reactionTime.toFixed(0)}ms
              </div>
              <div className="text-xl text-gray-300">
                Reaction Time
              </div>
            </div>
          )}

          {gameState === 'levelComplete' && countdown === 0 && (
            <div className="mb-8">
              <div className="text-3xl font-bold text-green-400 mb-4">
                LEVEL {completedLevel} COMPLETE!
              </div>
              <div className="text-xl text-white mb-2">
                Level Score: +{stats.levelScore}
              </div>
              <div className="text-lg text-gray-300">
                Total Score: {stats.totalScore}
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="mb-8">
              <div className="text-4xl font-bold text-red-400 mb-4">
                GAME OVER
              </div>
              <div className="text-xl text-white mb-2">
                Final Score: {stats.totalScore}
              </div>
              {stats.bestTime && (
                <div className="text-lg text-gray-300">
                  Best Time: {stats.bestTime.toFixed(0)}ms
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleClick}
            disabled={gameState === 'levelComplete' || gameState === 'gameOver'}
            className="px-12 py-6 bg-gradient-to-r from-green-400 to-pink-500 hover:from-green-500 hover:to-pink-600 text-black text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameState === 'levelComplete' ? 'LEVEL COMPLETE' :
             gameState === 'gameOver' ? 'PLAY AGAIN' : 'CLICK HERE'}
          </button>

          {gameState === 'gameOver' && (
            <div className="mt-6">
              <Link href="/" className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}