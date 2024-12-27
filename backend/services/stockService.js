// backend/services/stockService.js
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const API_KEY = process.env.UPSTOX_API_KEY;
const API_SECRET = process.env.UPSTOX_API_SECRET;
const TOKEN_URL = 'https://api.upstox.com/v2/login/authorization/token';

// Function to Refresh Access Token Using Refresh Token
const refreshAccessToken = async (refresh_token) => {
  try {
    const response = await axios.post(TOKEN_URL, querystring.stringify({
      refresh_token: refresh_token,
      client_id: API_KEY,
      client_secret: API_SECRET,
      grant_type: 'refresh_token',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    });

    const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;
    return { access_token, refresh_token: new_refresh_token, expires_in };
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to Get Valid Access Token
const getAccessToken = async (req) => {
  if (!req.session.accessToken) {
    throw new Error('No access token available. Please authenticate.');
  }

  // Check if the access token has expired
  if (Date.now() > req.session.tokenExpiry) {
    console.log('Access token expired. Refreshing...');
    try {
      const refreshedToken = await refreshAccessToken(req.session.refreshToken);
      req.session.accessToken = refreshedToken.access_token;
      req.session.refreshToken = refreshedToken.refresh_token;
      req.session.tokenExpiry = Date.now() + refreshedToken.expires_in * 1000;
      return req.session.accessToken;
    } catch (error) {
      throw new Error('Failed to refresh access token. Please authenticate again.');
    }
  }

  return req.session.accessToken;
};

// Function to Fetch Stock Data
exports.fetchStockData = async (req, symbols) => {
  try {
    const accessToken = await getAccessToken(req);

    // Replace with the actual Upstox API endpoint for fetching stock data
    const url = `https://api.upstox.com/v2/market/stocks`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        symbols: symbols.join(','),
      },
    });

    // Process and return relevant stock data
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error.response ? error.response.data : error.message);
    throw error;
  }
};
