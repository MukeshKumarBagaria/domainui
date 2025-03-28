const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the dist directory (for the built component)
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Serve static files from the example directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// API endpoint for quote submission
app.post('/api/submit-quote', async (req, res) => {
  try {
    const { 
      domainName, 
      sellerEmail, 
      name, 
      email, 
      phone, 
      price, 
      message,
      currency = '$' 
    } = req.body;

    // Validate required fields
    if (!domainName || !sellerEmail || !name || !email || !phone || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Domain Quote <onboarding@resend.dev>',
      to: sellerEmail,
      subject: `New Quote Request for ${domainName}`,
      html: `
        <h2>New Domain Quote Request</h2>
        <p><strong>Domain:</strong> ${domainName}</p>
        <p><strong>Offered Price:</strong> ${currency}${price}</p>
        <h3>Buyer Information:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Quote submitted successfully',
      data
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`View the example at http://localhost:${port}`);
});
