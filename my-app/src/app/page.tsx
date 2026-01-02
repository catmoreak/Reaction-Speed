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



const HowToPlayCard = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (



    <div className="p-6 rounded-lg border border-gray-700 text-center transition-all duration-300 hover:border-green-400 hover:shadow-[inset_0_0_20px_rgba(0,255,0,0.3),inset_0_0_40px_rgba(0,255,0,0.2),inset_0_0_60px_rgba(0,255,0,0.1)] hover:bg-linear-to-br hover:from-green-900/30 hover:to-green-800/20 hover:animate-pulse relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-green-400/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="text-5xl font-bold text-green-400 mb-4 group-hover:text-shadow-[0_0_20px_#0f0,0_0_40px_#0f0] transition-all duration-300 relative z-10">{number}</div>
             <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-shadow-[0_0_10px_#0f0] transition-all duration-300 relative z-10">{title}</h3>
        <p className="text-gray-400 group-hover:text-green-300 transition-all duration-300 relative z-10">{children}</p>
    </div>
);



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
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
             {rainColumns.map(col => (
          <div key={col.id} className="absolute text-green-400 font-mono text-xs opacity-50" style={{left: col.left, animation: `matrixRain ${col.duration} linear infinite`, animationDelay: col.delay, textShadow: '0 0 5px #00ff00'}}>
            {col.text}
          </div>
        ))}
      </div>

      <main className="relative z-10">
        
        <section className={`text-center min-h-screen flex flex-col justify-center items-center px-4 py-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-wider mb-4" style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'}}>
                Reaction <span className="text-green-400">Speed</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
                Lets test how fast you are !!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                           <button onClick={handleGameStart} className="px-8 py-4 bg-green-500 hover:bg-green-600 text-gray-900 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/20">
                Start Challenge
                       </button>
              <button onClick={() => window.location.href = '/leaderboard'} className="px-8 py-4 border-2 border-gray-500 text-gray-300 hover:border-white hover:text-white text-lg font-semibold rounded-lg transition-all duration-300">
                                View Leaderboard
              </button>
            </div>
        </section>


        <section id="how-to-play" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">How to Play</h2>
                  

                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <HowToPlayCard number="1" title="WAIT">
                       Click on start buttona and wait for the screen to blink red to green
                    </HowToPlayCard>
                    <HowToPlayCard number="2" title="STRIKE">
                        The moment the screen turns green, click as fast as you can.
                    </HowToPlayCard>
                    <HowToPlayCard number="3" title="WIN">
                      Dont click too late and lose your hearts
                    </HowToPlayCard>
                </div>
            </div>
        </section>

     
      

        
        
      </main>

      <footer className="relative z-10 text-center py-6 border-t border-gray-700 mt-12">
        <p className="text-gray-500"> Ｍａｄｅ ｗｉｔｈ     ❤️</p>
      </footer>
    </div>
  );
}


