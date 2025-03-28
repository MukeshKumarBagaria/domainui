import React, { useState } from 'react';
import { DomainQuoteForm } from '../src';

function App() {
  const [selectedTheme, setSelectedTheme] = useState('light');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Domain Quote Reseller Demo</h1>
      
      <div className="max-w-md mx-auto mb-8 p-4 bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Theme Selection</h2>
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded ${selectedTheme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTheme('light')}
          >
            Light
          </button>
          <button 
            className={`px-4 py-2 rounded ${selectedTheme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTheme('dark')}
          >
            Dark
          </button>
          <button 
            className={`px-4 py-2 rounded ${selectedTheme === 'colorful' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedTheme('colorful')}
          >
            Colorful
          </button>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <DomainQuoteForm 
          domainName="premium-domain.com"
          sellerEmail="your-email@example.com"
          // Recommended approach (server-side API)
          apiEndpoint="/api/submit-quote"
          // Alternative approach (not recommended for production)
          // resendApiKey={process.env.RESEND_API_KEY}
          minPrice={500}
          maxPrice={10000}
          currency="$"
          theme={selectedTheme}
          // Optional custom styles (will override theme settings)
          // customStyles={{
          //   container: 'max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200',
          //   heading: 'text-2xl font-bold mb-6 text-blue-800 text-center',
          //   button: 'w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors'
          // }}
        />
      </div>
      
      <div className="mt-8 text-center text-gray-600">
        <p>This is a demo of the Domain Quote Reseller component.</p>
        <p>Replace the placeholder values with your actual domain and email.</p>
        <p className="mt-4 text-sm">
          <strong>Note:</strong> For production use, we recommend using the server-side API approach 
          to keep your API keys secure.
        </p>
      </div>
    </div>
  );
}

export default App;
