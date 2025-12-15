import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Menu from './features/menu/Menu';
import Home from './layout/Home';
import Cart from './features/cart/Cart';
import CreateOrder from './features/user/CreateOrder';
import Order from './features/order/Order';
import AppLayout from './layout/AppLayout';
import { loader as menuLoader } from './features/menu/Menu';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/menu', element: <Menu />, loader: menuLoader },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder /> },
      { path: 'order/:orderId', element: <Order /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
