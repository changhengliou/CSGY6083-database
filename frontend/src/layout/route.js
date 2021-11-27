import { lazy, Suspense } from 'react';
import { ReactComponent as DepartureSvg } from '../icons/departure.svg';
import { ReactComponent as SuitcaseSvg } from '../icons/suitcase.svg';
import { ReactComponent as ClipboardSvg } from '../icons/clipboard.svg';
import { ReactComponent as UserGroupSvg } from '../icons/user-group.svg';
const BookFlight = lazy(() => import('../frontpage/BookFlight'));
const FlightSearchResult = lazy(() => import('../frontpage/FlightSearchResult'));

const routes = [
  {
    route: '/',
    label: 'BOOK',
    icon: <DepartureSvg />,
    element: (
      <Suspense fallback={<>...</>}>
        <BookFlight />
      </Suspense>
    ),
    header: true
  },
  {
    route: '/trip',
    label: 'MY TRIPS',
    icon: <SuitcaseSvg />,
    header: true
  },
  {
    route: '/flight',
    label: 'FLIGHT STATUS',
    icon: <ClipboardSvg />,
    header: true
  },
  {
    route: '/member',
    label: 'MEMBERSHIP',
    icon: <UserGroupSvg />,
    header: true
  },
  {
    route: '/flight-search/result',
    element: (
      <Suspense fallback={<>...</>}>
        <FlightSearchResult />
      </Suspense>
    )
  }
];

export default routes;
