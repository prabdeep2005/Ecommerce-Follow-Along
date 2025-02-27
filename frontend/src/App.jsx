import { useEffect } from 'react';
import AuthPersist from "./components/AuthPersist";
import "./App.css";
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { checkAuthStatus } from './redux/actions/authActions';
import { ToastContainer } from 'react-toastify';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Signup from "./pages/Signup";
import EditProduct from "./pages/EditProduct";
import BecomeSeller from "./pages/BecomeSeller";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import UpdateProfile from "./pages/UpdateProfile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import MyProducts from './pages/MyProducts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/become-a-seller",
    element: (
      <ProtectedRoute>
        <BecomeSeller />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products-page",
    element: <ProductsPage />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/my-products",
    element: (
      <ProtectedRoute requiredRole="seller">
        <MyProducts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-profile",
    element: (
      <ProtectedRoute>
        <UpdateProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute requiredRole="seller">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/change-password",
    element: (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-product/:id",
    element: (
      <ProtectedRoute requiredRole="seller">
        <EditProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Error />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
      <AuthPersist>
        <RouterProvider router={router} />
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </AuthPersist>
  );
}

export default App;