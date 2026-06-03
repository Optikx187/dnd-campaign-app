import { useState } from 'react';
import VoiceControls from './VoiceControls';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DMChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: messageToSend, model: 'llama3' }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscript = (transcript: string) => {
    setInput(transcript);
  };

  const handleSpeak = (text: string) => {
    // Text-to-speech is handled by the VoiceControls component
    console.log('Speaking:', text);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Dungeon Master Chat</h1>
      
      <VoiceControls onTranscript={handleTranscript} onSpeak={handleSpeak} />
      
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Start a conversation with the Dungeon Master...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-green-100 mr-8'
              }`}
            >
              <strong>{msg.role === 'user' ? 'You' : 'DM'}:</strong>
              <p className="mt-1">{msg.content}</p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-gray-500 text-center">DM is thinking...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
