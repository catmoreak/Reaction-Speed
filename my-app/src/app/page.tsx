'use client';

import { useState, useEffect } from 'react';
import NameInput from '@/components/NameInput';

interface RainColumn {
  id: number;
  left: string;
  delay: string;
  duration: string;
  text: string;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [rainColumns, setRainColumns] = useState<RainColumn[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleGameStart = () => {
    setShowNameInput(true);
  };

  const handleNameSubmit = () => {
    
    window.location.href = '/game';
  };

  if (showNameInput) {
    return <NameInput onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        {rainColumns.map(col => (
          <div key={col.id} className="absolute text-green-400 font-mono text-sm opacity-80" style={{left: col.left, animation: `matrixRain ${col.duration} linear infinite`, animationDelay: col.delay, textShadow: '0 0 5px #00ff00'}}>
            {col.text}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        
       

        
        <div className={`text-center px-4 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto">
            

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight slight-rotate">
              
              <span className="block bg-linear-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent handwritten">
                Reaction Speed
              </span>
            </h1>

           

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button onClick={handleGameStart} className="group px-8 py-4 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-lg font-bold imperfect-border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/25 inline-block animate-float slight-skew">
                <span className="flex items-center space-x-2">
                  <span>  Start now </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              <button onClick={() => window.location.href = '/leaderboard'} className="px-8 py-4 border-2 border-slate-400 text-slate-300 hover:border-white hover:text-white text-lg font-semibold imperfect-border transition-all duration-300 slight-rotate">
                View Leaderboard
              </button>
            </div>
</div>
        </div>

      

        
        <section id="how-to-play" className="px-4 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How to Play</h2>
              <p className="text-xl text-slate-300">Get ready to test your reflexes!</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">1</div>
                <h3 className="text-xl font-bold text-white mb-2">Prepare</h3>
                <p className="text-slate-300">
                  Hit start and brace yourself. The screen turns red – get set!
                </p>
              </div>

              <div className="text-2xl text-white">→</div>

              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">2</div>
                <h3 className="text-xl font-bold text-white mb-2">React</h3>
                <p className="text-slate-300">
                  Green light! Click as fast as you can. Every millisecond matters!
                </p>
              </div>

              <div className="text-2xl text-white">→</div>

              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">3</div>
                <h3 className="text-xl font-bold text-white mb-2">Improve</h3>
                <p className="text-slate-300">
                  Check your time and try again. Beat your best score!
                </p>
              </div>
            </div>
          </div>
        </section>

        


      

        
        
        <footer className="px-4 py-8 bg-black/40">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-slate-400 text-sm">
             ReactionSpeed. Built with ❤️
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}