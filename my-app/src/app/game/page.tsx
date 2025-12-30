'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import GameDisplay from '../../components/GameDisplay';
import GameOverlays from '../../components/GameOverlays';

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

export type { GameState, GameStats, Level };

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
  const advancingLevelRef = useRef<boolean>(false);
  const levelAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
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
      if (levelAdvanceTimeoutRef.current) {
        clearTimeout(levelAdvanceTimeoutRef.current);
        levelAdvanceTimeoutRef.current = null;
      }
    };
  }, []);

  const startLevel = useCallback((levelNumber?: number) => {
    
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
    
    setCountdown(0);
    setShouldAdvanceLevel(false);
    setGameState('waiting');

    const targetLevelNum = levelNumber !== undefined ? levelNumber : stats.currentLevel;
    const level = LEVELS[targetLevelNum - 1];
    const delay = Math.random() * (level.maxWait - level.minWait) + level.minWait;

    waitingTimeoutRef.current = setTimeout(() => {
      setStartTime(performance.now());
      setGameState('ready');
      waitingTimeoutRef.current = null;
    }, delay);

    setStats(prev => {
      const newBestTime = prev.reactionTime && (!prev.bestTime || prev.reactionTime < prev.bestTime) 
        ? prev.reactionTime 
        : prev.bestTime;
      
      return {
        ...prev,
        currentLevel: targetLevelNum,
        bestTime: newBestTime
      };
    });
  }, [stats.currentLevel]);

  useEffect(() => {
    if (shouldAdvanceLevel && countdown > 0) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              setShouldAdvanceLevel(false);
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
  }, [shouldAdvanceLevel, countdown]);

  const currentLevel = LEVELS[stats.currentLevel - 1];

  const handleClick = useCallback(() => {
    if (gameState === 'levelComplete' || gameState === 'gameOver' || processingRef.current) {
      return;
    }
    
    if (gameState === 'ready') {
      processingRef.current = true;
      const endTime = performance.now();
      const reactionTime = endTime - startTime;
      const level = LEVELS[stats.currentLevel - 1];
      const graceTime = reactionTime < 150 ? level.targetTime + 250 : level.targetTime + 50;
      const isSuccess = reactionTime <= graceTime;

      if (isSuccess) {
        
        const points = level.points + Math.max(0, Math.floor((level.targetTime - reactionTime) / 10));
        
        
        setStats(prev => ({
          ...prev,
          reactionTime,
          bestTime: prev.bestTime ? Math.min(prev.bestTime, reactionTime) : reactionTime,
          levelScore: prev.levelScore + points,
          totalScore: prev.totalScore + points
        }));
        
        
        setCompletedLevel(stats.currentLevel);
        setGameState('levelComplete');
        
       
        const playerName = localStorage.getItem('reactionSpeed_userName') || 'Anonymous';
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: playerName,
            reactionTime,
            level: stats.currentLevel,
            score: points
          })
        }).catch(error => console.error('Failed to save score:', error));

        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: playerName })
        }).catch(error => console.error('Failed to save user:', error));

       
        levelAdvanceTimeoutRef.current = setTimeout(() => {
          const currentLevelNum = stats.currentLevel;
          if (currentLevelNum < LEVELS.length) {
            const nextLevel = currentLevelNum + 1;
            setStats(prev => ({ ...prev, levelScore: 0 }));
            startLevel(nextLevel);
          } else {
            setGameState('gameOver');
          }
          processingRef.current = false;
        }, 3000);
        
        return;
      } else {
        
        processingRef.current = false;
        const newLives = Math.max(0, stats.lives - 1);
        
        if (newLives <= 0) {
          setGameState('gameOver');
          setStats(prev => ({ ...prev, lives: 0 }));
        } else {
          setGameState('clicked');
          setCountdown(5);
          setStats(prev => ({ ...prev, lives: newLives }));
          
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
        return;
      }
    } else if (gameState === 'waiting') {
      setGameState('tooEarly');
      setCountdown(3);
      
      if (penaltyIntervalRef.current) clearInterval(penaltyIntervalRef.current);

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
  }, [gameState, startTime, stats.currentLevel, stats.lives, startLevel]);

  const resetGame = () => {
    setGameStarted(false);
    setShouldAdvanceLevel(false);
    setCompletedLevel(0);
    setIsProcessing(false);
    advancingLevelRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (levelAdvanceTimeoutRef.current) {
      clearTimeout(levelAdvanceTimeoutRef.current);
      levelAdvanceTimeoutRef.current = null;
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
    if (gameState === 'levelComplete' && stats.reactionTime) {
      const level = LEVELS[stats.currentLevel - 1];
      const isSuccess = stats.reactionTime <= level.targetTime;
      const points = Math.floor(level.points + Math.max(0, Math.floor((level.targetTime - stats.reactionTime) / 10)));
      
      return (
        <div className="text-center relative px-8 max-w-6xl mx-auto overflow-y-auto max-h-screen py-12">
          <div className="relative z-10 space-y-8">
            
            <div className="mb-8">
              <div className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4 relative" 
                   style={{
                     textShadow: '0 1px 0 #1f2937, 0 2px 0 #111827, 0 3px 0 #030712, 0 6px 8px rgba(0,0,0,0.5), 0 12px 20px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.3)',
                     transform: 'perspective(800px) rotateX(10deg) translateZ(20px)',
                     transformStyle: 'preserve-3d'
                   }}>
                <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                      style={{
                        filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.6))'
                      }}>
                  {isSuccess ? 'LEVEL CLEARED' : 'COMPLETED'}
                </span>
              </div>
              <div className="h-1 w-48 bg-linear-to-r from-transparent via-cyan-400 to-transparent mx-auto"
                   style={{
                     boxShadow: '0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)'
                   }}></div>
            </div>
            
            
            <div className="relative mb-8 group"
                 style={{
                   transform: 'perspective(1500px) rotateX(5deg) translateZ(30px)',
                   transformStyle: 'preserve-3d'
                 }}>
              
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"
                   style={{
                     transform: 'translateZ(-20px)'
                   }}></div>
              
              <div className="relative bg-linear-to-br from-gray-900 via-gray-900/95 to-black backdrop-blur-2xl rounded-3xl p-8 border border-white/5 overflow-hidden"
                   style={{
                     boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 20px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.5)'
                   }}>
              
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent -skew-x-12 animate-pulse"></div>
                
                
                <div className="absolute inset-0 opacity-[0.02]"
                     style={{
                       backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                       backgroundSize: '50px 50px'
                     }}></div>
                
                <div className="relative z-10">
                  <div className="text-xs text-cyan-400/60 mb-3 uppercase tracking-[0.3em] font-bold">Reaction Time</div>
                  <div className="text-7xl md:text-8xl font-black mb-6 leading-none relative"
                       style={{
                         background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                         textShadow: '0 1px 0 rgba(0,0,0,0.8), 0 2px 0 rgba(0,0,0,0.6)',
                         filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.4))'
                       }}>
                    {stats.reactionTime.toFixed(0)}
                    <span className="text-4xl md:text-5xl ml-2 opacity-80">ms</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
                    <div className="text-center px-4 py-3 bg-white/5 rounded-2xl border border-white/10"
                         style={{
                           boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)'
                         }}>
                      <div className="text-cyan-400/50 text-xs mb-2 uppercase tracking-wider font-semibold">TARGET</div>
                      <div className="text-3xl font-black text-white/90"
                           style={{
                             textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                           }}>{level.targetTime}ms</div>
                    </div>
                    {stats.reactionTime < level.targetTime && (
                      <>
                        <div className="h-12 w-px bg-linear-to-b from-transparent via-cyan-500/30 to-transparent"></div>
                        <div className="text-center px-4 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
                             style={{
                               boxShadow: '0 0 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                             }}>
                          <div className="text-emerald-400/70 text-xs mb-2 uppercase tracking-wider font-semibold">FASTER BY</div>
                          <div className="text-3xl font-black text-emerald-400"
                               style={{
                                 textShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 2px 4px rgba(0,0,0,0.5)'
                               }}>
                            {(level.targetTime - stats.reactionTime).toFixed(0)}ms
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                
                  <div className="inline-block relative"
                       style={{
                         transform: 'translateZ(20px)',
                         transformStyle: 'preserve-3d'
                       }}>
                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl"></div>
                    <div className="relative px-8 py-4 rounded-full bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 backdrop-blur-sm"
                         style={{
                           boxShadow: '0 4px 12px rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)'
                         }}>
                      <span className="text-cyan-400 font-black text-xl uppercase tracking-wider"
                            style={{
                              textShadow: '0 0 20px rgba(34, 211, 238, 0.8), 0 2px 4px rgba(0,0,0,0.8)'
                            }}>
                        {isSuccess ? 'EXCELLENT PERFORMANCE' : 'GOOD EFFORT'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="relative mt-8">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"></div>
              <div className="relative text-5xl md:text-6xl font-black mb-2"
                   style={{
                     textShadow: '0 1px 0 rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.7), 0 4px 0 rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.6), 0 16px 32px rgba(0,0,0,0.4)',
                     transform: 'perspective(800px) rotateX(8deg) translateZ(40px)',
                     transformStyle: 'preserve-3d'
                   }}>
                <span className="bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                      style={{
                        filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.4))'
                      }}>
                  +{points}
                </span>
              </div>
              <div className="text-lg text-cyan-400/60 font-bold uppercase tracking-[0.2em]"
                   style={{
                     textShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
                   }}>
                POINTS EARNED
              </div>
            </div>
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

        
        <GameDisplay
          gameState={gameState}
          stats={stats}
          currentLevel={currentLevel}
          countdown={countdown}
          gameStarted={gameStarted}
          getBackgroundColor={getBackgroundColor}
          getMessage={getMessage}
          getMessageClass={getMessageClass}
          getReactionDisplay={getReactionDisplay}
          onClick={handleClick}
          onStart={() => { setGameStarted(true); startLevel(); }}
        />

        <GameOverlays
          gameState={gameState}
          countdown={countdown}
          stats={stats}
          getMessage={getMessage}
          getMessageClass={getMessageClass}
          getReactionDisplay={getReactionDisplay}
          onResetGame={resetGame}
        />

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
