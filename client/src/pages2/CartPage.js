import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import axios from 'axios';
import './cartPage.css';
import { MdDeleteForever } from 'react-icons/md';
import { CiSquarePlus, CiSquareMinus } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import Header2 from '../components/header/Header2';
import Footer from '../components/footer/Footer';
import { base_url } from '../utils/config';


const CartPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const [productData, setProductData] = useState([]);
  useEffect(() => {
    axios.get(`${base_url}/api/products`)
      .then(res => {
        // Filter products where selected is equal to "1"
        const selectedProducts = res.data.filter(product => product.selected === "1");
        setProductData(selectedProducts);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

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

  const updateQuantityOnServer = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.p_id === itemId) {
        return { ...item, quantity: newQuantity, email: user?.email };
      }
      return item;
    });

    axios.put(`${base_url}/api/updateCartItem/${itemId}`, { quantity: newQuantity, email: user?.email })
      .then(() => {
        // Update the local state after a successful update on the server
        setCartItems(updatedCartItems);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteItemOnServer = (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      // Include the user's email in the request body
      const requestData = { email: user?.email };

      axios.delete(`${base_url}/api/deleteCartItem/${itemId}`, { data: requestData })
        .then(() => {
          // Update the local state after successful deletion on the server
          const updatedCartItems = cartItems.filter((item) => item.p_id !== itemId);
          setCartItems(updatedCartItems);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleIncrement = (itemId) => {
    const updatedQuantity = cartItems.find((item) => item.p_id === itemId).quantity + 1;
    updateQuantityOnServer(itemId, updatedQuantity);
  };

  const handleDecrement = (itemId) => {
    const currentQuantity = cartItems.find((item) => item.p_id === itemId).quantity;
    if (currentQuantity > 1) {
      const updatedQuantity = currentQuantity - 1;
      updateQuantityOnServer(itemId, updatedQuantity);
    }
  };

  const handleDelete = (itemId) => {
    deleteItemOnServer(itemId);
  };

  const calculateTotalPrice = (items) => {
    const totalPrice = items.reduce(
      (total, item) =>
        total +
        (parseFloat((item.product_mrp * (1 - item.offer / 100)).toFixed(2)) || 0) * item.quantity,
      0
    );

    const deliveryCharges = totalPrice > 5000 ? 0 : 200;

    return {
      totalPrice: (totalPrice * 1).toFixed(2),
      finalPrice: (totalPrice + deliveryCharges).toFixed(2),
      deliveryCharges: (deliveryCharges * 1).toFixed(2),
    };
  };

  const { totalPrice, deliveryCharges, finalPrice } = calculateTotalPrice(cartItems);

  return (
    <>
      <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
        <Header2 />
      </div>

      <div className='body_class_10'>
        <div className="card_50">
          <div className="row">
            <div className="col-md-8 cart_50">
              <div className="title">
                <div className="row">
                  <div className="col"><h4><b>Shopping Cart</b></h4></div>
                  <div className="col align-self-center text-right text-muted">items : {cartItems.length} </div>
                </div>
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cartItems.map((item) => {
                  const product = productData.find((product) => product._id === item.p_id);

                  return (
                    <div key={item.p_id} className="row border-top border-bottom">
                      <div className="row main align-items-center">
                        <div className="col-2">
                          {product && product.product_img ? (
                            <img
                              className="imges-fluid"
                              src={product.product_img}
                              alt={product.product_name}
                            />
                          ) : product && product.product_images && product.product_images.length > 0 ? (
                            <img
                              className="imges-fluid"
                              src={`data:image/png;base64,${product.product_images[0].data}`}
                              alt={product.product_name}
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>
                        <div className="col">
                          <div className="row text-muted">{product && product.product_type}</div>
                          <div className="row">{product && product.product_name}</div>
                        </div>
                        <div className='col'>
                          <div className="row text-muted"> Price</div>
                          <div className="row">&#8377; {(item.product_mrp * (1 - item.offer / 100)).toFixed(2)}</div>
                        </div>

                        <div className="col">
                          <div className="row text-muted">  Quantity</div>
                          <div>
                            <span className='spanclass1' onClick={() => handleDecrement(item.p_id)}><CiSquareMinus /></span>
                            <span className="border">{item.quantity}</span>
                            <span className='spanclass2' onClick={() => handleIncrement(item.p_id)}><CiSquarePlus /></span>
                          </div>
                        </div>
                        <div className='col'>
                          <div className="row text-muted">Total price</div>
                          <div className="row">&#8377; {(item.product_mrp * (1 - item.offer / 100) * item.quantity).toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="close spanclass" onClick={() => handleDelete(item.p_id)}><MdDeleteForever /></span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="col-md-4 summary_99">
              <div><h5><b>Summary</b></h5></div>
              <div className='spacebt'>
                <hr className='hrtag' />
                <div className="row">
                  <div className="col" style={{ paddingLeft: 0 }}>ITEMS : {cartItems.length}</div>
                  <div className="col text-right">&#8377; {totalPrice}</div>
                </div>
              </div>
              {deliveryCharges > 0 && (
                <div className='spacebt'>
                  <div className='row'>
                    <div className="col" style={{ paddingLeft: 0 }}>DELIVERYCHARGES</div>
                    <div className="col text-right">&#8377; {deliveryCharges}</div>
                  </div>
                </div>
              )}
              <div className="row" style={{ borderTop: '1px solid rgba(0,0,0,.1)', padding: '2vh 0' }}>
                <div className="col">TOTAL PRICE</div>
                <div className="col text-right">&#8377; {finalPrice}</div>
              </div>
              <Link to='/invoice'><button className="btn" >CHECKOUT</button></Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
