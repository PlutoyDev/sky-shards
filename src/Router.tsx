import { LoaderFunctionArgs, createBrowserRouter, redirect } from 'react-router-dom';
import { DateTime } from 'luxon';
import Home from './page/Home';
import { nextShardInfo } from './shardPredictor';

const relDateMap = {
  eytd: -2,
  ereyesterday: -2,
  ytd: -1,
  yesterday: -1,
  today: 1,
  tomorrow: 1,
  ovmr: 2,
  overmorrow: 2,
};

function absDateLoader({ params: { year, month, day } }: LoaderFunctionArgs) {
  try {
    if (year) {
      if (year.length === 2) {
        year = `20${year}`;
      }

      const absDate = DateTime.local(parseInt(year, 10), month ? parseInt(month, 10) : 1, day ? parseInt(day, 10) : 1, {
        zone: 'America/Los_Angeles',
      });

      if (!absDate.isValid || absDate.hasSame(DateTime.local().setZone('America/Los_Angeles'), 'day')) {
        return redirect('/');
      }

      //Minimum date is 2022-10-01
      if (absDate < DateTime.local(2022, 10, 1, { zone: 'America/Los_Angeles' })) {
        return redirect(`/date/2022/10/01`);
      }

      return { absDate };
    }
  } catch (e) {
    return redirect('/');
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:relDateName',
    element: <Home />,
    loader: ({ params: { relDateName } }) => {
      if (relDateName && relDateName in relDateMap) {
        return { relDate: relDateMap[relDateName as keyof typeof relDateMap] };
      } else {
        return redirect('/');
      }
    },
  },
  {
    path: '/date/:year/:month/:day',
    element: <Home />,
    loader: absDateLoader,
  },
  {
    path: '/date/:year/:month',
    element: <Home />,
    loader: absDateLoader,
  },
  {
    path: '/date/:year',
    element: <Home />,
    loader: absDateLoader,
  },
  {
    path: '/next',
    element: <Home />,
    loader: () => {
      const today = DateTime.local().setZone('America/Los_Angeles');
      return redirect(`/date/${nextShardInfo(today).date.toFormat('yyyy/MM/dd')}`);
    },
  },
  {
    path: '/next/red',
    element: <Home />,
    loader: () => {
      const today = DateTime.local().setZone('America/Los_Angeles');
      return redirect(`/date/${nextShardInfo(today, { colorIsRed: true }).date.toFormat('yyyy/MM/dd')}`);
    },
  },
  {
    path: '/next/black',
    element: <Home />,
    loader: () => {
      const today = DateTime.local().setZone('America/Los_Angeles');
      return redirect(`/date/${nextShardInfo(today, { colorIsRed: false }).date.toFormat('yyyy/MM/dd')}`);
    },
  },
]);

export default router;
