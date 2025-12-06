'use client';

import { useState, useEffect } from 'react';
import NameInput from '@/components/NameInput';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        
       

        
        <div className={`text-center px-4 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto">
            

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              Challenge Your
              <span className="block bg-linear-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Reaction Speed
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Play the ultimate reaction speed game. Test your reflexes in milliseconds,
              compete with friends, and climb the leaderboards!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button onClick={handleGameStart} className="group px-8 py-4 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/25 inline-block animate-float">
                <span className="flex items-center space-x-2">
                  <span>  Start now </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-slate-400 text-slate-300 hover:border-white hover:text-white text-lg font-semibold rounded-2xl transition-all duration-300">
                View Leaderboard
              </button>
            </div>

            
           
          </div>
        </div>

      

        
        <section id="how-to-play" className="px-4 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How to Play</h2>
              <p className="text-xl text-slate-300">Simple rules, endless challenge</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-red-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Wait</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Click start and prepare yourself. The screen will turn red, signaling you to get ready.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-ping animation-delay-1000"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">React</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  When the screen turns green, click as fast as humanly possible. Every millisecond counts!
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full animate-ping animation-delay-2000"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Improve</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  View your results and keep practicing. Track your improvement over time!
                </p>
              </div>
            </div>
          </div>
        </section>

        


        
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Prove Your Speed?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join millions of players worldwide who are competing to be the fastest. Are you ready to claim your spot at the top?
            </p>
            <button onClick={handleGameStart} className="px-12 py-5 bg-linear-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25 inline-block">
             Start Playing Now
            </button>
          </div>
        </section>

        
        
        <footer className="px-4 py-8 bg-black/40 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-slate-400 text-sm">
              © 2025 ReactionSpeed. Built with ❤️
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
