import { Header } from './layout/index';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes from './layout/route';
import { AuthProvider } from './auth';
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
