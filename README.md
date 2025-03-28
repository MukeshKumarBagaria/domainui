# Domain Quote Reseller Component

A React component for domain name reselling that allows potential buyers to submit quotation requests for domain names. The component sends email notifications to the domain seller using the Resend API.

## Features

- **Plug-and-Play Component**: Easy to install and integrate into any React application
- **Email Notifications**: Automatically sends emails to the domain seller with buyer details
- **Customizable Price Range**: Set minimum and maximum price limits for domain quotes
- **Secure API Handling**: Multiple options for secure email sending
- **Predefined Themes**: Choose from light, dark, and colorful themes
- **Responsive UI**: Modern, clean interface that works on all devices
- **Form Validation**: Built-in validation for email, phone number, and price range

## Installation

```bash
npm install domain-quote-reseller
```

## Usage

### Basic Implementation

```jsx
import React from 'react';
import { DomainQuoteForm } from 'domain-quote-reseller';

function App() {
  return (
    <div className="App">
      <DomainQuoteForm 
        domainName="example.com"
        sellerEmail="your-email@example.com"
        apiEndpoint="/api/submit-quote" // Recommended approach
        minPrice={500}
        maxPrice={5000}
        theme="light" // Choose from 'light', 'dark', or 'colorful'
      />
    </div>
  );
}

export default App;
```

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `domainName` | string | The domain name being quoted |
| `sellerEmail` | string | Email address where quotes will be sent |
| `apiEndpoint` OR `resendApiKey` | string | Either provide a server endpoint or Resend API key |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minPrice` | number | 100 | Minimum acceptable price |
| `maxPrice` | number | 10000 | Maximum price (for UI slider) |
| `currency` | string | '$' | Currency symbol |
| `theme` | string | 'light' | Predefined theme ('light', 'dark', 'colorful') |
| `customStyles` | object | {} | Custom styling options (overrides theme) |

## Secure Email Handling

### Option 1: Server-Side API (Recommended)

Create a server endpoint that handles the email sending. This keeps your API keys secure.

```jsx
<DomainQuoteForm 
  domainName="example.com"
  sellerEmail="your-email@example.com"
  apiEndpoint="/api/submit-quote"
/>
```

Example server implementation (Next.js API route):

```javascript
// pages/api/submit-quote.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domainName, sellerEmail, name, email, phone, price, message } = req.body;
  
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'Domain Quote <onboarding@resend.dev>',
      to: sellerEmail,
      subject: `New Quote Request for ${domainName}`,
      html: `
        <h2>New Domain Quote Request</h2>
        <p><strong>Domain:</strong> ${domainName}</p>
        <p><strong>Offered Price:</strong> $${price}</p>
        <h3>Buyer Information:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
```

### Option 2: Client-Side API Key (Not Recommended for Production)

```jsx
<DomainQuoteForm 
  domainName="example.com"
  sellerEmail="your-email@example.com"
  resendApiKey={process.env.REACT_APP_RESEND_API_KEY}
/>
```

⚠️ **Warning**: This approach exposes your API key in client-side code and should only be used for development or testing.

## Theme Options

The component comes with three predefined themes:

### Light Theme (Default)
```jsx
<DomainQuoteForm 
  theme="light"
  // other props
/>
```

### Dark Theme
```jsx
<DomainQuoteForm 
  theme="dark"
  // other props
/>
```

### Colorful Theme
```jsx
<DomainQuoteForm 
  theme="colorful"
  // other props
/>
```

## Custom Styling

You can also provide custom styles that will override the theme settings:

```jsx
<DomainQuoteForm 
  domainName="example.com"
  sellerEmail="your-email@example.com"
  apiEndpoint="/api/submit-quote"
  customStyles={{
    container: 'max-w-md mx-auto p-6 bg-blue-50 rounded-lg shadow-md',
    heading: 'text-2xl font-bold mb-4 text-blue-800',
    button: 'w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700'
  }}
/>
```

## Security Considerations

- Never hardcode your Resend API key in your source code
- Use environment variables to store sensitive information
- Consider implementing rate limiting to prevent spam submissions
- The server-side API approach is strongly recommended for production environments

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
