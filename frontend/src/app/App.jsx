import React, { Suspense, lazy } from 'react';
import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import { Header } from '../components/Header';
import { SellerHeader } from '../components/SellerHeader';
import { Footer } from '../components/Footer';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Routes, Route, useLocation } from 'react-router-dom';

const Account = lazy(() => import('../pages/Account'));
const OrderDetails = lazy(() => import('../pages/OrderDetails'));
const Error = lazy(() => import('../pages/Error'));
const MobileData = lazy(() => import('../pages/MobileData'));
const Category = lazy(() => import('../pages/Category'));
const Categories = lazy(() => import('../pages/Categories'));
const Cart = lazy(() => import('../pages/Cart'));
const ProductForm = lazy(() => import('../pages/ProductForm'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SellerOrders = lazy(() => import('../pages/SellerOrders'));
const SellerDashboard = lazy(() => import('../pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const Login = lazy(() => import('../pages/Login'));
const Profile = lazy(() => import('../pages/Profile'));
const ProductListing = lazy(() => import('../pages/ProductListing'));
const Address = lazy(() => import('../pages/Address'));
const Payment = lazy(() => import('../pages/Payment'));
const Order = lazy(() => import('../pages/Order'));
const ViewProduct = lazy(() => import('../pages/ViewProduct'));
const Home = lazy(() => import('../pages/Home'));
const Product = lazy(() => import('../pages/Product').then((module) => ({ default: module.Product })));

function App() {
  const location = useLocation();
  const sellerRoutes = ["/seller", "/sellerOrders", "/addProduct", "/viewProducts"];
  const isSellerRoute = sellerRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/")
  );

  return (
    <div className="app-shell">
      {isSellerRoute ? <SellerHeader /> : <Header />}
      <main className="app-main">
        <Suspense fallback={<div className="route-loading">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/product" element={<Product />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/orderDetails" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/mobiledata/:id" element={<MobileData />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/viewProducts" element={<ProtectedRoute roles={["ROLE_SELLER", "ROLE_ADMIN"]}><ProductListing /></ProtectedRoute>} />
            <Route path="/addProduct" element={<ProtectedRoute roles={["ROLE_SELLER", "ROLE_ADMIN"]}><ProductForm /></ProtectedRoute>} />
            <Route path="/seller" element={<ProtectedRoute roles={["ROLE_SELLER", "ROLE_ADMIN"]}><SellerDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={["ROLE_ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/sellerOrders" element={<ProtectedRoute roles={["ROLE_SELLER", "ROLE_ADMIN"]}><SellerOrders /></ProtectedRoute>} />
            <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
            <Route path="/view" element={<ViewProduct />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
