import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../../ui/Button';

function OrderSearch() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!orderId.trim()) return;

    navigate(`/order/${orderId}`);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 text-center space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-red-700">🥷 Track Your Order</h1>

        <p className="text-gray-600">
          Enter your order ID and let the Pizza Samurai find your slice.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Order ID (e.g. SDDS0001)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            className="flex-1 border rounded-md px-4 py-3 text-(--sp-black) focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <Button
            type="submit"
            className=" cursor-pointer text-white px-5 py-3 rounded-md flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!orderId.trim()}
          >
            <Search className="w-5 h-5" />
            Search
          </Button>
        </form>

        {/* Hint */}
        <p className="text-sm text-gray-400">Your order ID is shown after checkout</p>
      </div>
    </div>
  );
}
export default OrderSearch;
