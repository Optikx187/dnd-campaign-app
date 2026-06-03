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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2 rounded ${currentView === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                DM Chat
              </button>
              <button
                onClick={() => setCurrentView('character')}
                className={`px-4 py-2 rounded ${currentView === 'character' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Character Sheet
              </button>
              <button
                onClick={() => setCurrentView('rules')}
                className={`px-4 py-2 rounded ${currentView === 'rules' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Rules Lawyer
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="p-4">
        {currentView === 'chat' && <DMChat />}
        {currentView === 'character' && <CharacterSheet />}
        {currentView === 'rules' && <RulesLawyer />}
      </div>
    </div>
  )
}

export default App
