import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import routes from './route';
import { ReactComponent as SigninSvg } from '../icons/signin.svg';

const renderLink = (routes) => {
  return routes.filter(el => el.header).map((el, index) => {
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
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            { renderLink(routes) }
          </Nav>
          <Nav>
            <Link to="/admin/stats" className="text-light fs-6 d-flex align-items-center nav-link">
              <span className="me-2">DASHBOARD</span> <SigninSvg />
            </Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </div>
    </Navbar>
  );
};