import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemix = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    setError('')
    setOutputText('')

    try {
      console.log('API Key:', import.meta.env.VITE_ANTHROPIC_API_KEY?.slice(0, 10) + '...')
      
      const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      })

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        temperature: 1,
        messages: [{
          role: "user",
          content: `Please remix the following content to make it more engaging and creative, while maintaining its core message. Make it more lively and interesting, but keep the key information intact: "${inputText}"`
        }]
      })

      if (response.content && response.content[0] && response.content[0].text) {
        setOutputText(response.content[0].text)
      } else {
        throw new Error('Unexpected API response format')
      }
    } catch (err) {
      console.error('Detailed error:', err)
      setError(err.message || 'Failed to remix content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Content Remixer
        </h1>
        <div className="space-y-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text to remix
            </label>
            <textarea
              id="content"
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              placeholder="Paste your content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleRemix}
              disabled={isLoading || !inputText.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Remixing...' : 'Remix Content'}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              Remixed Output
            </h2>
            <div className="w-full p-3 min-h-[150px] bg-gray-50 border border-gray-300 rounded-md">
              {isLoading ? (
                <p className="text-gray-500 italic">Generating remix...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : outputText ? (
                <p className="whitespace-pre-wrap">{outputText}</p>
              ) : (
                <p className="text-gray-500 italic">Your remixed content will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
