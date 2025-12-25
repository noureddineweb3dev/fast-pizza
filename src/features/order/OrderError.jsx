import { Link, useParams, useRouteError } from 'react-router-dom';

function OrderError() {
  const error = useRouteError();
  const { orderId } = useParams();

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-red-700 mb-4">
        ⚔️ Order <span className="text-red-950">{orderId}</span> Lost in Battle
      </h1>

      <p className="text-gray-600 mb-6">{error?.statusText || 'We couldn’t find this order.'}</p>

      <Link to="/" className="px-6 py-3 bg-red-700 text-white rounded-md hover:bg-red-800">
        Back to Dojo
      </Link>
    </div>
  );
}
export default OrderError;
