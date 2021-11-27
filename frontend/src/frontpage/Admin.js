import { NavLink, Outlet } from 'react-router-dom';
import routes from "../layout/route";

const adminRoutes = routes.filter(el => el.route === '/admin')[0].children || [];
const Admin = () => {
  return (
    <div className="row">
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark col-4 col-sm-3 col-lg-2" style={{minHeight: "calc(100vh - 60px)"}}>
        <ul className="nav nav-pills flex-column mb-auto">
          {
            adminRoutes.map((el, idx) => (
              <li className="nav-item" key={`${el.route}_${idx}`}>
                <NavLink to={el.route} className="nav-link text-white">
                  { el.label }
                </NavLink>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="col-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
