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
    <>
      <div className="text-center px-4 py-4">
        <h2 className="text-3xl font-bold text-white mb-2">{currentLevel.name}</h2>
        <div className="text-sm text-gray-400">
          Target: {currentLevel.targetTime}ms
        </div>
      </div>

      <div className="flex justify-center px-4 py-8">
        <div
          className={`w-full max-w-2xl h-96 imperfect-border ${getBackgroundColor()} cursor-pointer flex flex-col items-center justify-center text-white transition-all duration-150 shadow-2xl hover:scale-101 active:scale-98 border-4 border-white/20 slight-rotate`}
          onClick={onClick}
        >
          <div className={getMessageClass()}>{getMessage()}</div>
          {getReactionDisplay()}
        </div>
      </div>

      <div className="flex justify-center px-4 mb-8">
        {stats.currentLevel === 1 && gameState === 'waiting' && countdown === 0 && !gameStarted && (
          <button
            onClick={onStart}
            className="px-12 py-6 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-2xl font-bold imperfect-border transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-red-400 glow-border animate-float handwritten slight-skew"
          >
            START LEVEL 1
          </button>
        )}
      </div>
    </>
  );
}