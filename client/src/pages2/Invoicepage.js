import React, { useState, useEffect } from 'react';
import './invoice.css';
// import { useCart } from './CartContext';
// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header2 from '../components/header/Header2';
import Footer from "../components/footer/Footer"
import Loader from "../components/loader/Loader"
import { base_url } from '../utils/config';



const Invoicepage = () => {
  const navigate = useNavigate();
  // const { cartItems, setCartItems } = useCart();
  const currentDateIST = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
  });

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);


  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (user?.email) {
      axios.get(`${base_url}/api/cart?email=${user.email}`)
        .then((res) => {
          // Filter the data on the client side based on status1 === 0
          const filteredData = res.data.filter(item => item.status1 === 0);
          setCartItems(filteredData);
          console.log(filteredData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user]);
  



  function generateOrderId() {
    // Generate a random 6-digit number
    const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
    
    // Combine with a prefix or any other formatting you may need
    const orderId = `ORD-${randomSixDigitNumber}`;
    
    return orderId;
  }
  
  
  
  function getCurrentDate() {
    const currentDate = new Date();
    
    // Get the current date in the format YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  function getCurrentTime() {
    const currentTime = new Date();
    
    // Get the current time in the format HH:MM:SS
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  }
  
  const handleCashOnDelivery = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty. Add items before placing an order.');
      return;
    }

    const userEmail = user?.email;

    if (!userEmail) {
      toast.error('User email is not available.');
      return;
    }

    const orderId = generateOrderId();

    // setLoading(true); // Set loading state to true
    setLoading(true);

    const updateStatusPromises = cartItems.map((item) => {
      const updatedItem = {
        ...item,
        status1: 1,
        orderId: orderId,
        date: getCurrentDate(),
        time: getCurrentTime(),
        type: 'cash on delivery',
        userEmail: userEmail,
      };
      const requestData = { email: user?.email };

      return axios.put(`${base_url}/api/updateOrderStatus`, { data1: updatedItem, data2: requestData })
        .catch((error) => {
          throw error;
        });
    });

    Promise.all(updateStatusPromises)
      .then(() => {

        const updatedCartItems = cartItems.map((item) => ({
          ...item,
          status1: 1,
          orderId: orderId,
          date: getCurrentDate(),
          time: getCurrentTime(),
          type: 'cash on delivery'
        }));
        setCartItems(updatedCartItems);
        setLoading(true)

        setTimeout(() => {
          setLoading(false); // Set loading state to false after a 2-second delay
        }, 1000);
        
        toast.success('Your order is placed!');
        navigate('/product');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to update order status. Please try again.');
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after the request is complete
      });
  };


  
  

  const handleOnlinePayment = () => {
    // Clear the cart items
    
    // Navigate to the checkout page after clearing cart items
    navigate('/checkout');
  };

  // Function to calculate total price based on cart items
  const calculateTotalPrice = () => {
    let subtotal = 0;

    // Calculate subtotal for all items in the cart
    cartItems.forEach((item) => {
      subtotal += ((item.product_mrp*(1-item.offer/100)).toFixed(2))* item.quantity;
    });

    const total = subtotal;

    return {
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
    };
  };
  const { subtotal, total } = calculateTotalPrice();
  
  const handlePrint = () => {
    window.print(); // Trigger the browser's print functionality
  };
  return (
    <>
     <div style={{position:'fixed', width:'100%', zIndex:'9999', top:'0' }}>
      <Header2/>
      </div>
    <div className="invoice_5">
      <header className="header_9">
        <h1>Invoice</h1>
        
        <div className="invoice-details">
          <div className="details_9">
            <p>Date: {currentDateIST}</p>
            
          
            <p>Argo-Organic Farm Delicacy</p>
            <p>Name :{user?.name} </p>
            <p>Address :{user?.address} </p>
            {/* <p>State:{user?.state},Pincode:{user?.pincode}</p> */}
            <p>Phone Number:{user?.phonenumber}</p>
          </div>
        </div>
      </header>
      <main className="main">
        <table className="table_19">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>&#8377;{(item.product_mrp*(1-item.offer/100)).toFixed(2)}</td>
                <td>&#8377;{(item.product_mrp*(1-item.offer/100) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className="footer_1">
        <div className="footer-details">
          <p >Subtotal: &#8377;{subtotal}</p>
          <p>Delivery Charges: &#8377;200.00</p>
          <p>Total: &#8377;{(total*1+200).toFixed(2)}</p>
        </div>
        <div>
        <button className='btn_class'  onClick={handlePrint}>Download</button>

          <button className='btn_class' onClick={handleCashOnDelivery}>Cash on Delivery</button>
          
          <button  className='btn_class'  onClick={handleOnlinePayment}>Online Pay</button>
        </div>
      </footer>
      <ToastContainer />
    </div>
    <Footer/>
    <div className='loader_in'>{loading && <Loader />}</div>
    
    </>
  );
};

export default Invoicepage;
