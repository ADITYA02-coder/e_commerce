import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.js'
import './style.css';
import { Header } from './Header';
import {Product} from './Product';
import { Footer } from './Footer';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { Account } from './Account';
import OrderDetails from './OrderDetails';
import Error from './Error';
import MobileData from './MobileData';
import Category from './Category';
import Cart from './Cart';
import ProductForm from './ProductForm';
import LoginPage from './LoginPage';
import SellerOrders from './SellerOrders.js';
import SellerDashboard from './SellerDashboard.js';
import Login from './Login.js';
import Profile from './Profile.js';
import ProductListing from './ProductListing.js';
import Address from './Address.js';
import Payment from './Payment.js';
import Order from './Order.js';
import { TestModule } from './TestModule.js';
import ViewProduct from './ViewProduct.js';
import Home from './Home.js';

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/signup" element={<LoginPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/orderDetails' element={<OrderDetails/>}/>
        <Route path = "/category/:categoryName" element={<Category/>}/>
        <Route path = "/mobiledata/:id" element={<MobileData/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/viewProducts' element={<ProductListing/>}/>
        <Route path='/addProduct' element={<ProductForm/>}/>
        <Route path='/seller' element={<SellerDashboard/>}/>
        <Route path='/sellerOrders' element={<SellerOrders/>}/>
        <Route path='/address' element={ <Address/> }/>
        <Route path='/payment' element={ <Payment/> }/>
        <Route path='/order' element={ <Order/> }/>
        <Route path='/test' element={ <TestModule/> }/>
        <Route path='/view' element={<ViewProduct/>}/>



        
        <Route path = "*" element={<Error/>}/>

        
      </Routes>
      <Footer/>
    </>
    
  );
}

export default App;
