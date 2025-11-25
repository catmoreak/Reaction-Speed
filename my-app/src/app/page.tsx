export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
       
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Reaction Speed</h1>
          <p className="text-xl text-slate-300">Test your reflexes and challenge your speed</p>
        </div>

        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-linear-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <h2 className="text-3xl font-semibold text-white mb-4">Ultimate Reaction Test</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Challenge yourself with the most accurate reaction speed test. Measure your reflexes in milliseconds 
              and compete with friends to see who has the fastest reactions!
            </p>
          </div>
          
          <button className="px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-xl transition-all hover:scale-105 shadow-lg">
            Start Game
          </button>
        </div>

        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Precision Testing</h3>
            <p className="text-slate-300">Accurate millisecond timing for professional-grade reaction measurement</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Detailed Stats</h3>
            <p className="text-slate-300">Track your best times, averages, and improvement over multiple rounds</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">Challenge Mode</h3>
            <p className="text-slate-300">Multiple game modes to test different aspects of your reaction speed</p>
          </div>
        </div>

    
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How to Play</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Wait</h3>
              <p className="text-slate-300">Click start and wait for the signal. Stay focused and ready!</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">React</h3>
              <p className="text-slate-300">When the screen turns green, click as fast as humanly possible!</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Improve</h3>
              <p className="text-slate-300">View your time and keep practicing to get faster reactions!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
