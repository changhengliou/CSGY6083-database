import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ReactComponent as DepartureSvg } from '../icons/departure.svg';
import { ReactComponent as SuitcaseSvg } from '../icons/suitcase.svg';
import { ReactComponent as ClipboardSvg } from '../icons/clipboard.svg';
import { ReactComponent as UserGroupSvg } from '../icons/user-group.svg';
import { ReactComponent as SigninSvg } from '../icons/signin.svg';

const routes = [
  {
    route: '/book',
    label: 'BOOK',
    icon: <DepartureSvg />,
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
const renderLink = (routes) => {
  return routes.map((el, index) => {
    return (
      <Link
        key={`${el.route}_${index}`}
        to={el.route}
        className="text-light fs-6 d-flex align-items-center nav-link"
      >
        <span className="me-2">{el.label}</span> {el.icon}
      </Link>
    );
  });
};

export const Header = () => {
  return (
    <Navbar expand="md" className="bg-dark" variant="dark">
      <div className="d-flex w-100 px-4 py-2 justify-content-between">
        <Link to="/" className="navbar-brand text-light fs-3">CSGY6083</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            { renderLink(routes) }
          </Nav>
          <Nav className="">
            <Link to="/user/login" className="text-light fs-6 d-flex align-items-center nav-link">
              <span className="me-2">LOGIN</span> <SigninSvg />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};