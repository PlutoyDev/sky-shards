import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Shard, { ShardPageLoader } from './page/Shard';

export const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '',
        element: <Shard />,
      },
      {
        path: '/*',
        element: <Shard />,
        loader: ShardPageLoader,
      },
    ],
  },
]);

export default router;
