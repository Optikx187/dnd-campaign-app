import { useState } from 'react'
import DMChat from './components/ui/DMChat'
import CharacterSheet from './components/ui/CharacterSheet'
import RulesLawyer from './components/ui/RulesLawyer'
import LoginForm from './components/auth/LoginForm'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<'chat' | 'character' | 'rules'>('chat')

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (data.user) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐉</span>
              <h1 className="text-xl font-bold text-white">D&D Campaign</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'chat' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                🎭 DM Chat
              </button>
              <button
                onClick={() => setCurrentView('character')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'character' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                ⚔️ Character
              </button>
              <button
                onClick={() => setCurrentView('rules')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'rules' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                📜 Rules
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="p-6">
        {currentView === 'chat' && <DMChat />}
        {currentView === 'character' && <CharacterSheet />}
        {currentView === 'rules' && <RulesLawyer />}
      </div>
    </div>
  )
}

export default App
