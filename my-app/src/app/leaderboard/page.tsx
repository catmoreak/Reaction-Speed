"use client";

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  userName: string;
  score: number;
  reactionTime: number;
  level: number;
  timestamp: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid font-mono text-white">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid font-mono text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 uppercase"
              style={{ textShadow: '0 0 10px #00f' }}>
            Leaderboard
          </h1>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center">
            <div className="text-xl text-gray-400">
              No scores yet. Start playing now to see your score
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={`${entry.userName}-${entry.timestamp}`}
                className="bg-black/60 border border-green-500/30 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-green-400 w-8">
                      #{entry.rank}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {entry.userName}
                      </div>
                      <div className="text-sm text-gray-400">
                        Level {entry.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {entry.score}
                    </div>
                    <div className="text-sm text-green-400">
                      {entry.reactionTime}ms
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="/game"
            className="px-8 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600"
          >
            Play Game
          </a>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;