import { createBrowserRouter, redirect } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useNow } from './context/Now';
import Home from './page/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

export default router;
