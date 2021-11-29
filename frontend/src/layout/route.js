import { lazy, Suspense } from 'react';
import { ReactComponent as DepartureSvg } from '../icons/departure.svg';
import { ReactComponent as SuitcaseSvg } from '../icons/suitcase.svg';
import { ReactComponent as ClipboardSvg } from '../icons/clipboard.svg';
import { ReactComponent as UserGroupSvg } from '../icons/user-group.svg';
const BookFlight = lazy(() => import('../frontpage/BookFlight'));
const FlightSearchResult = lazy(() => import('../frontpage/FlightSearchResult'));
const MyTrip = lazy(() => import('../frontpage/MyTrip'));
const FlightStatus = lazy(() => import('../frontpage/FlightStatus'));
const Admin = lazy(() => import('../frontpage/Admin'));
const Airline = lazy(() => import('../frontpage/Airline'));
const Flight = lazy(() => import('../frontpage/Flight'));
const Airport = lazy(() => import('../frontpage/Airport'));
const TripSummary = lazy(() => import('../frontpage/TripSummary'));
const InsurancePlan = lazy(() => import('../frontpage/InsurancePlan'));

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
    header: true,
    element: (
      <Suspense fallback={<>...</>}>
        <MyTrip />
      </Suspense>
    )
  },
  {
    route: '/flight',
    label: 'FLIGHT STATUS',
    icon: <ClipboardSvg />,
    header: true,
    element: (
      <Suspense fallback={<>...</>}>
        <FlightStatus />
      </Suspense>
    )
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
  },
  {
    route: '/trip-summary',
    element: (
      <Suspense fallback={<>...</>}>
        <TripSummary />
      </Suspense>
    )
  },
  {
    route: '/admin',
    element: (
      <Suspense fallback={<>...</>}>
        <Admin />
      </Suspense>
    ),
    children: [
      { 
        route: '/admin/airline', 
        label: 'Airline', 
        element: (
          <Suspense fallback={<>...</>}>
            <Airline />
          </Suspense>
        ) 
      },
      { 
        route: '/admin/airport', 
        label: 'Airport', 
        element: (
          <Suspense fallback={<>...</>}>
            <Airport />
          </Suspense>
        ) 
      },
      { 
        route: '/admin/flight', 
        label: 'Flight', 
        element: (
          <Suspense fallback={<>...</>}>
            <Flight />
          </Suspense>
        )
      },
      { 
        route: '/admin/insurance', 
        label: 'Insurance Plan', 
        element: (
          <Suspense fallback={<>...</>}>
            <InsurancePlan />
          </Suspense>
        )
      },
      { route: '/admin/customer', label: 'Customer', element: <div>Customer</div> }
    ]
  }
];

export default routes;
