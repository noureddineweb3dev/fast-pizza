import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Menu from './features/menu/Menu';
import Home from './layout/Home';
import Cart from './features/cart/Cart';
import CreateOrder, { action as createOrderAction } from './features/order/CreateOrder';
import Order from './features/order/Order';
import OrderHistory from './features/order/OrderHistory';
import AppLayout from './layout/AppLayout';
import { loader as menuLoader } from './features/menu/Menu';
import SamuraiError from './ui/SamuraiError';
import MenuError from './features/menu/MenuError';
import OrderSearch from './features/order/OrderSearch';
import { loader as orderLoader } from './features/order/Order';
import OrderError from './features/order/OrderError';
import Favorites from './features/favorites/Favorites';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <SamuraiError />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <MenuError />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/order', element: <OrderSearch /> },
      { path: '/order/history', element: <OrderHistory /> },
      {
        path: '/order/new',
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: 'order/:orderId',
        element: <Order />,
        loader: orderLoader,
        errorElement: <OrderError />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
