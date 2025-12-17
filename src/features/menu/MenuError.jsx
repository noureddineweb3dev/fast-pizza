import { useNavigate, useRouteError } from 'react-router-dom';

function Error() {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-5xl font-extrabold text-red-700 mb-4">⚔️ Menu Under Attack!</h1>

      <p className="text-lg text-gray-700 mb-2">
        Our Pizza Samurai failed to retrieve today’s menu.
      </p>

      <p className="text-sm text-gray-500 mb-6">
        {error?.statusText || error?.message || 'Unknown error occurred'}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(0)}
          className="px-6 py-3 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
        >
          Retry
        </button>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition hover:text-(--sp-black)"
        >
          Back to Dojo
        </button>
      </div>
    </div>
  );
}

export default Error;
