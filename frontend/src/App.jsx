// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import StockCard from './components/StockCard';
import axios from 'axios';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStocks = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get('http://localhost:4000/api/stocks', {
        params: {
          symbols: 'NIFTY,SENSEX', // You can make this dynamic based on user input
        },
      });
      if (response.data.success) {
        setStocks(response.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="p-4 w-80">
      <h1 className="text-2xl font-bold mb-4">Upstock Plugin</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={fetchStocks}
      >
        Refresh
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Failed to load stock data.</p>}
      <div className="grid gap-4">
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default App;
