import React, { Suspense, lazy } from 'react';
import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import { Header } from '../components/Header';
import { SellerHeader } from '../components/SellerHeader';
import { Footer } from '../components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';

const Account = lazy(() => import('../pages/Account'));
const OrderDetails = lazy(() => import('../pages/OrderDetails'));
const Error = lazy(() => import('../pages/Error'));
const MobileData = lazy(() => import('../pages/MobileData'));
const Category = lazy(() => import('../pages/Category'));
const Cart = lazy(() => import('../pages/Cart'));
const ProductForm = lazy(() => import('../pages/ProductForm'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SellerOrders = lazy(() => import('../pages/SellerOrders'));
const SellerDashboard = lazy(() => import('../pages/SellerDashboard'));
const Login = lazy(() => import('../pages/Login'));
const Profile = lazy(() => import('../pages/Profile'));
const ProductListing = lazy(() => import('../pages/ProductListing'));
const Address = lazy(() => import('../pages/Address'));
const Payment = lazy(() => import('../pages/Payment'));
const Order = lazy(() => import('../pages/Order'));
const ViewProduct = lazy(() => import('../pages/ViewProduct'));
const Home = lazy(() => import('../pages/Home'));
const Product = lazy(() => import('../pages/Product').then((module) => ({ default: module.Product })));
const TestModule = lazy(() => import('../pages/TestModule'));

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
        <Suspense fallback={<div className="route-loading">Loading page…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product" element={<Product />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orderDetails" element={<OrderDetails />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/mobiledata/:id" element={<MobileData />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/viewProducts" element={<ProductListing />} />
            <Route path="/addProduct" element={<ProductForm />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/sellerOrders" element={<SellerOrders />} />
            <Route path="/address" element={<Address />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order" element={<Order />} />
            <Route path="/test" element={<TestModule />} />
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
