import { lazy, Suspense } from 'react';
import { ReactComponent as DepartureSvg } from '../icons/departure.svg';
import { ReactComponent as SuitcaseSvg } from '../icons/suitcase.svg';
import { ReactComponent as ClipboardSvg } from '../icons/clipboard.svg';
import { ReactComponent as UserGroupSvg } from '../icons/user-group.svg';
const BookFlight = lazy(() => import('../frontpage/BookFlight'));

const routes = [
  {
    route: '/book',
    label: 'BOOK',
    icon: <DepartureSvg />,
    element: (
      <Suspense fallback={<>...</>}>
        <BookFlight />
      </Suspense>
    )
  },
  {
    route: '/trip',
    label: 'MY TRIPS',
    icon: <SuitcaseSvg />,
  },
  {
    route: '/flight',
    label: 'FLIGHT STATUS',
    icon: <ClipboardSvg />,
  },
  {
    route: '/member',
    label: 'MEMBERSHIP',
    icon: <UserGroupSvg />,
  }
];

export default routes;
