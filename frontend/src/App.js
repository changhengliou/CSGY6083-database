import { Header } from './layout/index';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes from './layout/route';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        { 
          routes.map((route, index) => (
            <Route
              key={`${route.route}_${index}`}
              path={route.route}
              element={route.element}
            >
              {
                (route.children || []).map((route, index) => (
                  <Route
                    key={`${route.route}_${index}`}
                    path={route.route}
                    element={route.element}
                  />
                ))
              }
            </Route>
          )) 
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
