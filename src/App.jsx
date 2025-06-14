import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout'
import { routes, routeArray } from '@/config/routes.jsx'
import { store } from '@/store'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="h-screen flex flex-col overflow-hidden bg-background">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              {routeArray.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!bg-surface !text-gray-900 !border !border-primary/20"
          progressClassName="!bg-accent"
          className="!z-[9999]"
/>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;