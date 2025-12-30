import { getOrder } from '../../services/apiRestaurant';
import { useLoaderData } from 'react-router-dom';

function Order() {
  const order = useLoaderData();

  const { id, status, priority, priorityPrice, orderPrice, estimatedDelivery, cart } = order;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-700">🥷 Order #{id}</h1>

        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Delivery info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-2">
        <p className="font-medium text-neutral-700">
          Estimated delivery:
          <span className="ml-2 text-red-700 font-semibold">{estimatedDelivery}</span>
        </p>

        {priority && (
          <p className="text-sm text-red-600 font-semibold">⚡ Priority delivery enabled</p>
        )}
      </div>

      {/* Order items */}
      <div className="bg-white rounded-lg shadow p-6 text-neutral-700">
        <h2 className="text-xl font-semibold mb-4">🍕 Your Order</h2>

        <ul className="divide-y">
          {cart.map((item) => (
            <li key={item.pizzaId} className="py-3 flex justify-between">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-2 text-neutral-700">
        <p className="flex justify-between">
          <span>Order price</span>
          <span>${orderPrice.toFixed(2)}</span>
        </p>

        {priority && (
          <p className="flex justify-between text-red-700 font-medium">
            <span>Priority fee</span>
            <span>${priorityPrice.toFixed(2)}</span>
          </p>
        )}

        <p className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${(orderPrice + priorityPrice).toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);

  if (!order) {
    throw new Response('Order not found', { status: 404 });
  }

  return order;
}

export default Order;
