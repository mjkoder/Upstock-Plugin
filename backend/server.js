// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware Configuration
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json());

// Session Configuration
const your_session_secret = process.env.SESSION_SECRET;
app.use(session({
  secret: your_session_secret, // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true,
}));

// Routes
const stockRoutes = require('./routes/stockRoutes');
app.use('/api/stocks', stockRoutes);

// OAuth Routes

// Step 1: Redirect to Upstox Authorization URL
app.get('/auth', (req, res) => {
  const { state } = req.query; // Optional: Use state for CSRF protection
  const params = querystring.stringify({
    response_type: 'code',
    client_id: process.env.UPSTOX_API_KEY,
    redirect_uri: process.env.REDIRECT_URI,
    state: state || 'random_state_string', // Replace with secure random string in production
    scope: 'read', // Replace with actual required scopes
  });
  const authURL = `https://api.upstox.com/v2/login/authorization/dialog?${params}`;
  res.redirect(authURL);
});

// Step 2: Handle Callback and Exchange Code for Token
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Optional: Validate state parameter to prevent CSRF
  if (state !== 'random_state_string') { // Replace with actual state validation
    return res.status(400).send('Invalid state parameter');
  }

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://api.upstox.com/v2/login/authorization/token', querystring.stringify({
      code: code,
      client_id: process.env.UPSTOX_API_KEY,
      client_secret: process.env.UPSTOX_API_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Store tokens and expiry in session
    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    req.session.tokenExpiry = Date.now() + expires_in * 1000; // Current time + expires_in seconds

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to authenticate.');
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
