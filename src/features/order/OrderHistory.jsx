import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllOrders, clearOrderHistory } from '../../store/orderHistorySlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';

function OrderHistory() {
  const dispatch = useDispatch();
  const orders = useSelector(getAllOrders);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearHistory = () => {
    dispatch(clearOrderHistory());
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-16 h-16 text-gray-400" />
        </div>

        <h2 className="text-3xl font-bold text-sp-black mb-3">No Order History</h2>

        <p className="text-gray-600 mb-8 max-w-md">
          You haven't placed any orders yet. Start exploring our menu!
        </p>

        <Link to="/menu">
          <Button variant="primary" size="lg">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sp-black">Order History</h1>
            <p className="text-gray-600 mt-1">{orders.length} total orders</p>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear history
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderHistoryCard key={order.id} order={order} index={index} />
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClearHistory}
        title="Clear order history?"
        message="This will permanently delete all your order history. This action cannot be undone."
        confirmText="Yes, clear history"
        cancelText="Keep history"
        variant="danger"
      />
    </>
  );
}

// ORDER HISTORY CARD COMPONENT

function OrderHistoryCard({ order, index }) {
  const { id, customer, date, status, totalPrice, items, priority } = order;

  // Format date
  const orderDate = new Date(date);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Status icon and color
  const statusConfig = {
    preparing: { icon: Clock, color: 'yellow', label: 'Preparing' },
    delivering: { icon: Package, color: 'blue', label: 'Delivering' },
    delivered: { icon: CheckCircle, color: 'green', label: 'Delivered' },
  };

  const StatusIcon = statusConfig[status]?.icon || Clock;
  const statusColor = statusConfig[status]?.color || 'gray';
  const statusLabel = statusConfig[status]?.label || status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-sp-black">Order #{id}</h3>
              {priority && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  ⚡ Priority
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {formattedDate} at {formattedTime}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-800`}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{statusLabel}</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-2">Items:</p>
          <div className="flex flex-wrap gap-2">
            {items.slice(0, 3).map((item, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {item.quantity}× {item.name}
              </span>
            ))}
            {items.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                +{items.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xl font-bold text-sp-black">{formatCurrency(totalPrice)}</div>

          <Link to={`/order/${id}`}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderHistory;
