import { lazy, Suspense } from 'react';
import { ReactComponent as DepartureSvg } from '../icons/departure.svg';
import { ReactComponent as SuitcaseSvg } from '../icons/suitcase.svg';
import { ReactComponent as ClipboardSvg } from '../icons/clipboard.svg';
import { ReactComponent as UserGroupSvg } from '../icons/user-group.svg';
import Loading from '../icons/loading';
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
const MealPlan = lazy(() => import('../frontpage/MealPlan'));
const Customer = lazy(() => import('../frontpage/Customer'));

const routes = [
  {
    route: '/',
    label: 'BOOK',
    icon: <DepartureSvg />,
    element: (
      <Suspense fallback={<Loading/>}>
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
      <Suspense fallback={<Loading/>}>
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
      <Suspense fallback={<Loading/>}>
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
      <Suspense fallback={<Loading/>}>
        <FlightSearchResult />
      </Suspense>
    )
  },
  {
    route: '/trip-summary',
    element: (
      <Suspense fallback={<Loading/>}>
        <TripSummary />
      </Suspense>
    )
  },
  {
    route: '/admin',
    element: (
      <Suspense fallback={<Loading/>}>
        <Admin />
      </Suspense>
    ),
    children: [
      { 
        route: '/admin/customer', 
        label: 'Customer', 
        element: (
          <Suspense fallback={<Loading/>}>
            <Customer />
          </Suspense>
        )
      },
      { 
        route: '/admin/airline', 
        label: 'Airline', 
        element: (
          <Suspense fallback={<Loading/>}>
            <Airline />
          </Suspense>
        ) 
      },
      { 
        route: '/admin/airport', 
        label: 'Airport', 
        element: (
          <Suspense fallback={<Loading/>}>
            <Airport />
          </Suspense>
        ) 
      },
      { 
        route: '/admin/flight', 
        label: 'Flight', 
        element: (
          <Suspense fallback={<Loading/>}>
            <Flight />
          </Suspense>
        )
      },
      { 
        route: '/admin/insurance', 
        label: 'Insurance Plan', 
        element: (
          <Suspense fallback={<Loading/>}>
            <InsurancePlan />
          </Suspense>
        )
      },
      // { 
      //   route: '/admin/meal', 
      //   label: 'Meal Plan', 
      //   element: (
      //     <Suspense fallback={<Loading/>}>
      //       <MealPlan />
      //     </Suspense>
      //   )
      // },
    ]
  }
];

export default routes;
