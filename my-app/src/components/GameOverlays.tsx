'use client';

import React from 'react';
import Link from 'next/link';
import { GameState, GameStats } from '../app/game/page';

interface GameOverlaysProps {
  gameState: GameState;
  countdown: number;
  stats: GameStats;
  getMessage: () => string;
  getMessageClass: () => string;
  getReactionDisplay: () => React.ReactElement | null;
  onResetGame: () => void;
}

export default function GameOverlays({
  gameState,
  countdown,
  stats,
  getMessage,
  getMessageClass,
  getReactionDisplay,
  onResetGame
}: GameOverlaysProps) {
  return (
    <>
      {gameState === 'levelComplete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse animation-delay-700"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] animate-pulse animation-delay-1000"></div>
          </div>

          <div className="relative z-10">
            {countdown > 0 ? (
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white/80 mb-6 uppercase tracking-wide">
                  Get Ready
                </div>
                <div className="text-9xl md:text-[12rem] font-black text-white animate-pulse mb-4"
                     style={{
                       textShadow: '0 10px 40px rgba(59, 130, 246, 0.5), 0 20px 80px rgba(59, 130, 246, 0.3)',
                       filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))'
                     }}>
                  {countdown}
                </div>
                <div className={getMessageClass()}>{getMessage()}</div>
              </div>
            ) : (
              getReactionDisplay()
            )}
          </div>
        </div>
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
                onClick={onResetGame}
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
    </>
  );
}