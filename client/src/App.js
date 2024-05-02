import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/home/Home";
import Otp from "./pages2/Otp";
import Aboutus from './pages/AboutUs/About';
import { Register } from './pages/home/Register';
import { Login } from './pages/home/Login';
import { CustomerPage } from "./pages/home/CustomerPage";
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getLoginStatus } from './redux/features/auth/authSlice';
import Profile from './pages/profile/Profile';
import Orders from './pages/home/Orders';
import Sai from './pages/Sai';
import Admin from './pages2/Admin';
import Users from './pages2/Users';
import Products from './pages2/Products';
import Review from './pages2/Review';
import Feedbacks from './pages2/Feedbacks';
import Create from './pages2/Create';
import Pagenotfound from './pages2/Pagenotfound';
import Invoice from './pages2/Invoicepage';
import CheckoutPage from './pages2/CheckoutPage';
import Adminlogin from './pages2/Adminlogin';
import Cart_page from './pages2/CartPage';
import Sales from './pages2/Sales';
import CartData from './pages2/CartData';
import UserProfile from './pages2/UserProfile';
import UserProfileCart from './pages2/UserProfileCart';
import { CartProvider } from './pages2/CartContext';
import UserProfileProduct from './pages2/UserProfileProduct';
import CSVdata from './pages2/CSVdata';
import ProductDetail from "./pages2/ProductDetail";
import ConatctUs from "./pages2/ContactUs";
import ProductStats from "./pages2/ProductStats";
import { getUser } from './redux/features/auth/authSlice';

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    dispatch(getLoginStatus());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/otp" element={<Otp />} />
          <Route path='/register' element={<Register />} />
          <Route path="/register/:locationString" element={<Register />} />

          <Route path='/login' element={!user ? <Login /> : <Navigate to="/product" />} />
          <Route path='/customerpage' element={<CustomerPage />} />
          <Route path="/userprofile/profile" element={!user ? <Navigate to="/login" /> : <Profile />} />
          <Route path="/sai" element={<Sai />} />

          <Route path='/admin' element={<Admin />} />
          <Route path='/product' element={!user ? <Navigate to="/login" /> : <Create />} />
          <Route path='/cart' element={!user ? <Navigate to="/login" /> : <Cart_page />} />
          <Route path='/admin/users' element={<Users />} />
          <Route path='/admin/product' element={<Products />} />
          <Route path='/admin/feedbacks' element={<Review />} />
          <Route path='/admin/cartdata' element={<CartData />} />
          <Route path='/QAs' element={<Feedbacks />} />
          <Route path='/checkout' element={!user ? <Navigate to="/login" /> : <CheckoutPage />} />
          <Route path='/invoice' element={!user ? <Navigate to="/login" /> : <Invoice />} />
          <Route path='/adminlogin' element={<Adminlogin />} />
          <Route path='/sales' element={!user ? <Navigate to="/login" /> : <Sales />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/userprofile' element={!user ? <Navigate to="/login" /> : <UserProfile />} />
          <Route path='/userprofilecart' element={!user ? <Navigate to="/login" /> : <UserProfileCart />} />
          <Route path='/userprofileproduct' element={!user ? <Navigate to="/login" /> : <UserProfileProduct />} />
          <Route path='/csvd' element={!user ? <Navigate to="/login" /> : <CSVdata />} />
          <Route path='/contactus' element={<ConatctUs />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/productstas" element={<ProductStats />} />
          <Route path='*' element={<Pagenotfound />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;











// import {BrowserRouter ,Route,Routes} from 'react-router-dom'
// import Home from "./pages/home/Home";
// import Otp from "./pages2/Otp";
// import Aboutus from './pages/AboutUs/About';

// // import Footer from "./components/footer/Footer"
// import { Register } from './pages/home/Register';



// // import  Order  from './pages/home/Orders';
// import {Login} from './pages/home/Login';
// import {CustomerPage} from "./pages/home/CustomerPage"
// // import {Test} from "./pages/home/Test";
// import axios from 'axios';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useDispatch } from 'react-redux';
// import {useEffect} from 'react';
// import { getLoginStatus } from './redux/features/auth/authSlice';
// import Profile from './pages/profile/Profile';
// import Orders from './pages/home/Orders';
// import Sai from './pages/Sai';
// import Admin from './pages2/Admin';
// import Users from './pages2/Users';
// import Products from './pages2/Products';
// import Review from './pages2/Review';
// import Feedbacks from './pages2/Feedbacks';
// import Create from './pages2/Create';
// import Pagenotfound from './pages2/Pagenotfound';
// // import About from './pages2/About';
// import Invoice from './pages2/Invoicepage'
// import CheckoutPage from './pages2/CheckoutPage';
// import Adminlogin from './pages2/Adminlogin';
// import Cart_page from './pages2/CartPage';
// import Sales from './pages2/Sales';
// import CartData from './pages2/CartData';
// import UserProfile from './pages2/UserProfile';
// import UserProfileCart from './pages2/UserProfileCart';
// import { CartProvider } from './pages2/CartContext';
// import UserProfileProduct from './pages2/UserProfileProduct';
// import CSVdata from './pages2/CSVdata';
// import ProductDetail from "./pages2/ProductDetail";
// import ConatctUs from "./pages2/ContactUs";

// import ProductStats from "./pages2/ProductStats"



// function App() {
//   axios.defaults.withCredentials=true;
//   const dispatch=useDispatch()
//   useEffect(()=>{
//     dispatch(getLoginStatus())
//   },[dispatch])
//   return (
//    <BrowserRouter>
//    <ToastContainer/>
   
//    <CartProvider>
//    <Routes>

//     <Route path="/" element={<Home/>}/>
//     <Route path="/about" element={<Aboutus/>}/>
//     <Route path="/otp" element={<Otp/>}/>
//     <Route path='/register' element={<Register/>}/>
//     <Route path="/register/:locationString" element={<Register/>} />

//     <Route path='/login' element={<Login/>}/>
//     <Route path='/customerpage' element={<CustomerPage/>}/>
//     {/* <Route path='/test' element={<Test/>}/> */}
//     <Route path="/userprofile/profile" element={<Profile/>}/>
//     <Route path="/sai" element={<Sai/>}/>
    
//     <Route path='/admin' element={<Admin />} />
//     <Route path='/product' element={<Create />} />
//     <Route path='/cart' element={<Cart_page />} />
//     {/* <Route path='/review' element={<Review />} /> */}
//     <Route path='/admin/users' element={<Users />} />
//     <Route path='/admin/product' element={<Products />} />
//     <Route path='/admin/feedbacks' element={<Review />} />
//     <Route path='/admin/cartdata' element={<CartData />} />    
//     <Route path='/QAs' element={<Feedbacks />} />
//     <Route path='/checkout' element={<CheckoutPage />} />
//     <Route path='/invoice' element={<Invoice />} />
//     <Route path='/adminlogin' element={<Adminlogin />} />
//     <Route path='/sales' element={<Sales />} />
//     <Route path='/orders' element={<Orders />} />
//     {/* <Route path='/aboutus' element={<About />} /> */}
//     <Route path='/userprofile' element={<UserProfile />} />
//     <Route path='/userprofilecart' element={<UserProfileCart />} />
//     <Route path='/userprofileproduct' element={<UserProfileProduct />} />
//     <Route path='/csvd' element={<CSVdata />} />
//     <Route path='/contactus' element={<ConatctUs />} />
//     <Route path="/product/:productId" element={<ProductDetail  />} />
//     <Route path="/productstas" element={<ProductStats  />} />
//     <Route path='*' element={<Pagenotfound />}  />

   


//    </Routes>
//    </CartProvider>
  
//    {/* <Footer/> */}
//    </BrowserRouter>
//   );
// }

// export default App;














