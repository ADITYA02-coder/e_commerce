import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { Header } from './Header';
import {Product} from './Product';
import { Footer } from './Footer';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { Account } from './Account';
import OrderDetails from './OrderDetails';
import Sign from './Sign';
import Error from './Error';
import UserForm from './UserForm';
import Mobile from './Mobile';
import MobileData from './MobileData';
import Category from './Category';
import Cart from './Cart';
import MyComponent from './MyComponent';
import ProductForm from './ProductForm';
import LoginPage from './LoginPage';


function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path = "/" element={<LoginPage/>}/>
        <Route path = "/home" element={<Product/>}/>
        <Route path='/product' element={<Account/>}/>
        <Route path='/orderDetails' element={<OrderDetails/>}/>
        <Route path='/sign' element={<UserForm/>}/>
        <Route path = "/mobile" element={<Mobile/>}/>
        <Route path = "/category/:categoryName" element={<Category/>}/>
        <Route path = "/mobiledata" element={<MobileData/>}/>
        {/* <Route path='/cart' element={<Cart/>}/> */}
        <Route path='/cart' element={<MyComponent/>}/>
        <Route path='/xyz' element={<ProductForm/>}/>


        
        <Route path = "*" element={<Error/>}/>

        
      </Routes>
      <Footer/>
    </>
    
  );
}

export default App;
