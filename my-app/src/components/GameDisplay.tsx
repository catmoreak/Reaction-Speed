'use client';

import React from 'react';
import { GameState, GameStats, Level } from '../app/game/page';

interface GameDisplayProps {
  gameState: GameState;
  stats: GameStats;
  currentLevel: Level;
  countdown: number;
  gameStarted: boolean;
  getBackgroundColor: () => string;
  getMessage: () => string;
  getMessageClass: () => string;
  getReactionDisplay: () => React.ReactElement | null;
  onClick: () => void;
  onStart: () => void;
}

export default function GameDisplay({
  gameState,
  stats,
  currentLevel,
  countdown,
  gameStarted,
  getBackgroundColor,
  getMessage,
  getMessageClass,
  getReactionDisplay,
  onClick,
  onStart
}: GameDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">
          {currentLevel.name} <span className="text-green-400">Challenge</span>
        </h2>
        <div className="inline-block px-4 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
          <span className="text-sm text-green-400 font-mono font-bold uppercase tracking-widest">
            Target: {currentLevel.targetTime}ms
          </span>
        </div>
      </div>

      <div className="relative group">
      
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-500 z-20"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-500 z-20"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-500 z-20"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-500 z-20"></div>

        <div
          className={`w-full h-[400px] md:h-[500px] relative overflow-hidden cursor-pointer flex flex-col items-center justify-center text-white transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-green-500/20 bg-black/60 backdrop-blur-sm group-hover:border-green-500/50`}
          onClick={onClick}
        >
         
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-size-[100%_2px,3px_100%]"></div>
          
          <div className={`absolute inset-0 opacity-40 transition-colors duration-150 ${getBackgroundColor()}`}></div>

          <div className="relative z-20 flex flex-col items-center">
            <div className={`${getMessageClass()} text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>
              {getMessage()}
            </div>
            {getReactionDisplay()}
          </div>
         
          {gameState === 'waiting' && !gameStarted && (
            <div className="absolute bottom-10 left-0 right-0 text-center z-20 animate-pulse">
              <p className="text-green-400 font-mono text-sm uppercase tracking-[0.3em]">Wait for green...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-12">
        {stats.currentLevel === 1 && gameState === 'waiting' && countdown === 0 && !gameStarted && (
          <button
            onClick={onStart}
            className="px-12 py-5 bg-green-500 hover:bg-green-600 text-gray-900 text-2xl font-black rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] uppercase tracking-tighter"
          >
            START GAME
          </button>
        )}
      </div>
    </div>
  );
}