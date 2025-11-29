'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NameInput from '@/components/NameInput';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGameStart = () => {
    setShowNameInput(true);
  };

  const handleNameSubmit = (name: string) => {
    
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

        
        <section id="features" className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Play ReactionSpeed?</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                The ultimate reaction speed game designed for competitive players
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast Action</h3>
                <p className="text-slate-300 leading-relaxed">
                  Experience the thrill of split-second decisions. Every millisecond counts in this intense reaction challenge.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-linear-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Pro-Level Stats</h3>
                <p className="text-slate-300 leading-relaxed">
                  Track your scores, analyze your performance, and watch your reaction speed improve with detailed gaming stats.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-linear-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Competitive Leaderboards</h3>
                <p className="text-slate-300 leading-relaxed">
                  Battle friends and players worldwide. Climb the ranks and prove you're the fastest gamer alive!
                </p>
              </div>
            </div>
          </div>
        </section>

        
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
              🚀 Start Playing Now
            </button>
          </div>
        </section>

        
      
        
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-300">Everything you need to know</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">How does the game work?</h3>
                <p className="text-slate-300">Click the screen when it turns green as fast as possible! The game measures your reaction time in milliseconds with ultra-precise timing.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Can I compete with friends?</h3>
                <p className="text-slate-300">Absolutely! Share your scores and challenge friends to beat your times. We also have global leaderboards for competitive players.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Is this game fair and accurate?</h3>
                <p className="text-slate-300">Yes! Our game uses professional-grade timing technology that's more accurate than most reaction games available online.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">Can I get better at this game?</h3>
                <p className="text-slate-300">Definitely! Regular gameplay can improve your reaction speed. Many players see significant improvements and climb the leaderboards!</p>
              </div>
            </div>
          </div>
        </section>

        
       

        
        <footer className="px-4 py-16 bg-black/40 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-linear-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">⚡</span>
                  </div>
                  <span className="text-white font-bold text-2xl">ReactionSpeed</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The ultimate reaction speed gaming platform.
                  Challenge yourself and compete with players worldwide.
                </p>
                
              </div>

              
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-to-play" className="text-slate-400 hover:text-white transition-colors">How to Play</a></li>
                  <li><a href="#stats" className="text-slate-400 hover:text-white transition-colors">Statistics</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Leaderboards</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Tournaments</a></li>
                </ul>
              </div>

              
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>

              
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Community</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Players</span>
                    
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tests Taken</span>
                   
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">World Records</span>
                    
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Countries</span>
                    
                  </div>
                </div>
              </div>
            </div>

            
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                © 2025 ReactionSpeed. Built with ❤️</p> 
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
