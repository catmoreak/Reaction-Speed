'use client';

import { useState, useEffect } from 'react';
import NameInput from '@/components/NameInput';

export default function ThemedHome() {
  const [isVisible, setIsVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [theme, setTheme] = useState('cyberpunk');

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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  if (showNameInput) {
    return <NameInput onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
     
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
      </div>

     
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

      <div className="relative z-10">
       
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => handleThemeChange('cyberpunk')}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
              theme === 'cyberpunk' ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-cyan-400 hover:bg-gray-600'
            }`}
          >
            Cyberpunk
          </button>
          <button
            onClick={() => handleThemeChange('neon')}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
              theme === 'neon' ? 'bg-pink-500 text-black' : 'bg-gray-700 text-pink-400 hover:bg-gray-600'
            }`}
          >
            Neon
          </button>
        </div>

        <div className={`text-center px-4 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 mb-6 leading-tight animate-pulse">
              Challenge Your
              <span className="block text-white drop-shadow-lg">
                Reaction Speed
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Enter the neon-lit arena of reflexes. Test your speed in a cyberpunk world,
              compete globally, and become the ultimate reaction champion!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGameStart}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-600 hover:from-cyan-600 hover:to-pink-700 text-black text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-cyan-500/50 inline-block animate-bounce"
              >
                <span className="flex items-center space-x-2">
                  <span>⚡ Start Challenge</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:border-pink-400 hover:text-pink-400 text-lg font-semibold rounded-2xl transition-all duration-300 hover:bg-cyan-400">
                View Leaderboard
              </button>
            </div>
          </div>
        </div>

        <section id="how-to-play" className="px-4 py-20 bg-gradient-to-r from-gray-900 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">How to Play</h2>
              <p className="text-xl text-gray-300">Master the neon challenge</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group bg-gray-800/50 p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform border-4 border-red-400">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Prepare</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Hit start and brace yourself. The arena will glow red, signaling the imminent challenge.
                </p>
              </div>

              <div className="text-center group bg-gray-800/50 p-6 rounded-2xl border border-green-500/30 hover:border-green-400 transition-all">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-cyan-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform border-4 border-green-400">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-ping animation-delay-1000"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Strike</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  When the neon turns green, unleash your lightning-fast click. Precision in milliseconds!
                </p>
              </div>

              <div className="text-center group bg-gray-800/50 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform border-4 border-blue-400">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full animate-ping animation-delay-2000"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Evolve</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Analyze your performance and level up. Track your journey to reaction mastery!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Ready for the Cyber Challenge?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the elite circle of speed demons in this neon-drenched battleground. Can you claim the throne?
            </p>
            <button
              onClick={handleGameStart}
              className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-pink-500/50 inline-block hover:shadow-pink-400/70"
            >
              ⚡ Launch Challenge
            </button>
          </div>
        </section>

        <footer className="px-4 py-8 bg-black/60 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              © 2025 ReactionSpeed Cyber Edition
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}