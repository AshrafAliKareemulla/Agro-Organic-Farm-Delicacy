import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import './CheckOutpage.css';
import Header2 from '../components/header/Header2';
import Footer from "../components/footer/Footer"
// import { useCart } from './CartContext';
import axios from 'axios';
import Loader from "../components/loader/Loader"
import { base_url } from '../utils/config';




const CheckoutPage = () => {
  const navigate = useNavigate();
  // Regular expressions for validation
  // const { cartItems, setCartItems } = useCart();
  const cardNumberRegex = /^\d{16}$/;
  const cvvRegex = /^[0-9]{3}$/;
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const cardNumber = e.target.card_number.value;
    const cardType = e.target.card_type.value;
    // const expiryDate = e.target.exp_date.value;
    const cvv = e.target.cvv.value;

    const validationError = validateCheckoutForm(name, cardNumber, cardType, cvv);

    if (validationError) {
      setError(validationError);
    } else {
      toast.success('Thank you for your purchase');
      toast.success('Your order is placed');
      navigate('/product');

    }
  };

  const validateCheckoutForm = (name, cardNumber, cardType, cvv) => {
    if (!name.trim() || !cardNumber.trim() || !cardType  || !cvv.trim()) {
      return 'All fields are required';
    }

    if (!cardNumber.match(cardNumberRegex)) {
      return 'Please enter a valid card number';
    }

 
    if (!cvv.match(cvvRegex)) {
      return 'Please enter a valid CVV';
    }
   

    // Add more specific validation rules as needed

    return null; // Return null if no validation errors
  };


  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);


  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
  

const handleOnlinePayment = () => {
  if (cartItems.length === 0) {
    toast.warning('Your cart is empty. Add items before placing an order.');
    return;
  }

  const userEmail = user?.email; // Assuming user is defined somewhere in your component

  if (!userEmail) {
    toast.error('User email is not available.');
    return;
  }

  const orderId = generateOrderId();
  setLoading(true);


  const updateStatusPromises = cartItems.map((item) => {
    const updatedItem = {
      ...item,
      status1: 1,
      orderId: orderId,
      date: getCurrentDate(),
      time: getCurrentTime(),
      type:'Onlie payment',
      userEmail: userEmail, // Include user email in the request payload
    };
    const requestData = { email: user?.email };

    return axios.put(`${base_url}/api/updateOrderStatus`, {data1:updatedItem,data2:requestData})
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
        type:'Onlie payment'
      }));
      setCartItems(updatedCartItems);

      setLoading(true)

      setTimeout(() => {
        setLoading(false); // Set loading state to false after a 2-second delay
      }, 1000);

      toast.success('Your order is placed!');
      // You can navigate to the home page or perform any other actions here
      navigate('/')
    })
    .catch((err) => {
      console.log(err);
      toast.error('Failed to update order status. Please try again.');
    })
    .finally(() => {
      setLoading(false); // Set loading state to false after the request is complete
    });
  };

  const calculateTotalPrice = () => {
    let subtotal = 0;

    // Calculate subtotal for all items in the cart
    cartItems.forEach((item) => {
      subtotal += ((item.product_mrp*(1-item.offer/100)).toFixed(2))* item.quantity;
    });

    const total = subtotal+200;

    return {
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
    };
  };
  const { subtotal, total } = calculateTotalPrice();

  return (
    <>
     <div style={{position:'fixed', width:'100%', zIndex:'9999', top:'0' }}>
      <Header2/>
      </div>
    
    <div>
      <div className="mainscreen">
        <div className="card_data">
          <div className="leftside_1">
            <img src="https://t3.ftcdn.net/jpg/03/70/72/72/360_F_370727285_x2gQXerIT1g4Bv5soWCqeAqqUsnvO5bB.jpg" className="product_data" alt="Shoes" />
          </div>
          <div className="rightside">
            <form onSubmit={handleSubmit}>
              <h1>CheckOut</h1>
              <h2>Payment Information</h2>
              <p className='parag_1'>Cardholder Name</p>
              <input type="text" className="inputbox_1" name="name" required placeholder={user?.name} />
              <p className='parag_1'>Card Number</p>
              <input type="text" className="inputbox_1" name="card_number" id="card_number" required />
              <p className='parag_1'>Card Type</p>
              <select className="inputbox_1" name="card_type" id="card_type" required>
                <option value="">--Select a Card Type--</option>
                <option value="Visa">Visa</option>
                <option value="RuPay">RuPay</option>
                <option value="MasterCard">MasterCard</option>
              </select>
              <div className="expcvv">
                <p className="expcvv_text parag_1">Amount</p>
                <input type="text" className="inputbox_1" name="exp_date" id="exp_date" value={total} required />
                <p className="expcvv_text2 parag_1">CVV</p>
                <input type="password" className="inputbox_1" name="cvv" id="cvv" autoComplete=""  required />
              </div>
              <p />
              <button type="submit" className="button_btn" onClick={handleOnlinePayment}>CheckOut</button>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    <Footer/>
    <div className='loader_in'>{loading && <Loader />}</div>

    </>
  );
};

export default CheckoutPage;
