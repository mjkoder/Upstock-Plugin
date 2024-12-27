const stockService = require('../services/stockService');

exports.getStocks = async (req, res) => {
  try {
    const symbols = req.query.symbols ? req.query.symbols.split(',') : ['NIFTY', 'SENSEX'];
    const stockData = await stockService.fetchStockData(symbols);
    res.json({ success: true, data: stockData });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch stock data.' });
  }
};
