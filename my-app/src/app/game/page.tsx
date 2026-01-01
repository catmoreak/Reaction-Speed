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

interface RainColumn {
  id: number;
  left: string;
  delay: string;
  duration: string;
  text: string;
}

const LEVELS: Level[] = [
  { id: 1, name: "Level 1", minWait: 2000, maxWait: 4000, targetTime: 800, points: 20 },
  { id: 2, name: "Level 2", minWait: 1200, maxWait: 3000, targetTime: 600, points: 50 },
  { id: 3, name: "Level 3", minWait: 800, maxWait: 2200, targetTime: 400, points: 100 },
  { id: 4, name: "Level 4", minWait: 500, maxWait: 1500, targetTime: 250, points: 200 },
  { id: 5, name: "Level 5", minWait: 300, maxWait: 1000, targetTime: 100, points: 350 }
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
  const [rainColumns, setRainColumns] = useState<RainColumn[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const penaltyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef<boolean>(false);
  const waitingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const advancingLevelRef = useRef<boolean>(false);
  const levelAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const columns = Array.from({length: 100}, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 4}s`,
      text: Array.from({length: 25}, () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('')
    }));
    setRainColumns(columns);
  }, []);

  
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
      case 'preparing': return 'bg-blue-900/40';
      case 'waiting': return 'bg-red-900/60';
      case 'ready': return 'bg-green-500/60';
      case 'clicked': return 'bg-blue-900/60';
      case 'tooEarly': return 'bg-yellow-900/60';
      case 'levelComplete': return 'bg-green-500/20';
      case 'gameOver': return 'bg-gray-900/80';
      default: return 'bg-transparent';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'preparing': return `${countdown}`;
      case 'waiting': return 'HOLD';
      case 'ready': return 'STRIKE';
      case 'clicked': return countdown > 0 ? `PENALTY: ${countdown}` : 'TOO SLOW';
      case 'tooEarly': return countdown > 0 ? `PENALTY: ${countdown}` : 'EARLY CLICK';
      case 'levelComplete': 
        if (countdown > 0) {
          const nextLevel = stats.currentLevel < LEVELS.length ? stats.currentLevel + 1 : stats.currentLevel;
          return `LEVEL ${nextLevel} LOADING...`;
        } else {
          return '';
        }
      case 'gameOver': return stats.lives <= 0 ? 'GAME OVER' : 'MISSION COMPLETED';
      default: return 'READY?';
    }
  };

  const getMessageClass = () => {
    if (gameState === 'levelComplete') {
      return 'text-4xl md:text-5xl font-black mb-8 animate-pulse text-green-400 tracking-tighter uppercase';
    }
    if (gameState === 'ready') {
      return 'text-8xl md:text-9xl font-black mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]';
    }
    return 'text-6xl md:text-7xl font-black mb-4 animate-pulse uppercase tracking-tighter';
  };

  const getReactionDisplay = () => {
    if (gameState === 'levelComplete' && stats.reactionTime) {
      const level = LEVELS[stats.currentLevel - 1];
      const isSuccess = stats.reactionTime <= level.targetTime;
      const points = Math.floor(level.points + Math.max(0, Math.floor((level.targetTime - stats.reactionTime) / 10)));
      
      return (
        <div className="text-center relative px-4 max-w-2xl mx-auto">
          <div className="relative z-10 space-y-6">
            
            <div className="mb-4">
              <div className="h-1 w-32 bg-green-500 mx-auto shadow-[0_0_10px_#0f0]"></div>
            </div>
            
            <div className="relative p-8 bg-black/40 border border-green-500/30 rounded-2xl backdrop-blur-md">
              <div className="text-xs text-green-400/60 mb-2 uppercase tracking-[0.3em] font-mono">You did it </div>
              <div className="text-7xl md:text-8xl font-black mb-4 leading-none text-white tabular-nums">
                {stats.reactionTime.toFixed(0)}
                <span className="text-2xl md:text-3xl ml-2 text-green-400">ms</span>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest">Target score</div>
                  <div className="text-xl font-bold text-white">{level.targetTime}ms</div>
                </div>
                 
                
            
              </div>
            </div>
            
            <div className="relative">
              <div className="text-5xl md:text-6xl font-black text-white">
                <span className="text-green-400">+</span>{points}
              </div>
              <div className="text-xs text-green-400/60 font-mono uppercase tracking-[0.2em]">
                Points Earned
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {rainColumns.map(col => (
          <div key={col.id} className="absolute text-green-400 font-mono text-xs opacity-20" style={{left: col.left, animation: `matrixRain ${col.duration} linear infinite`, animationDelay: col.delay, textShadow: '0 0 5px #00ff00'}}>
            {col.text}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        
        <div className="flex justify-between items-center p-6 border-b border-green-500/30 bg-black/40 backdrop-blur-md">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_#0f0] transition-all duration-300">
              <span className="text-gray-900 font-black text-xl">1</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg leading-none">REACTION</span>
              <span className="text-green-400 font-bold text-xl tracking-widest">SPEED</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-xs text-green-400 font-bold tracking-tighter uppercase">Level</div>
              <div className="text-2xl font-black text-white">{stats.currentLevel}</div>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-center">
              <div className="text-xs text-green-400 font-bold tracking-tighter uppercase">Score</div>
              <div className="text-2xl font-black text-white">{stats.totalScore}</div>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-center">
              <div className="text-xs text-green-400 font-bold tracking-tighter uppercase">Lives</div>
              <div className="text-2xl font-black text-red-500 flex gap-1">
                {Array.from({length: 3}).map((_, i) => (
                  <span key={i} className={i < stats.lives ? 'opacity-100' : 'opacity-20'}>❤️</span>
                ))}
              </div>
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
