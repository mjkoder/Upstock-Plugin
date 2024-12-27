// frontend/src/components/StockCard.jsx
import PropTypes from 'prop-types';

const StockCard = ({ stock }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 flex flex-col">
      <h2 className="text-lg font-semibold">{stock.name} ({stock.symbol})</h2>
      <p className="mt-2">Current Price: ₹{stock.currentPrice}</p>
      <p>Change: {stock.percentageChange}%</p>
      <p>Day&apos;s High: ₹{stock.highPrice}</p>
      <p>Day&apos;s Low: ₹{stock.lowPrice}</p>
      <p>Volume: {stock.volume}</p>
    </div>
  );
};

StockCard.propTypes = {
  stock: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    currentPrice: PropTypes.number.isRequired,
    percentageChange: PropTypes.number.isRequired,
    highPrice: PropTypes.number.isRequired,
    lowPrice: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired
  }).isRequired
};

export default StockCard;
