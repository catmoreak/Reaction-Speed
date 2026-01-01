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
 
  getReactionDisplay,
  onResetGame
}: GameOverlaysProps) {
  return (
    <>

    </>
  );
}