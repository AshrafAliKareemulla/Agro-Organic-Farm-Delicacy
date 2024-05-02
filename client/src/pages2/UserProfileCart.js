import React, { useState, useEffect } from 'react';
import './profile_cart.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import Header2 from '../components/header/Header2';
import axios from 'axios';
import { RESET_AUTH, logout } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "./register.png";
import { base_url } from '../utils/config';



const UserProfileCart = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);
  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/Register");
  };

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // Default to 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);


  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${base_url}/api/cart?email=${user.email}`)
        .then((res) => {
          // Sort the data based on a specific property, e.g., orderedDate
          const sortedData = res.data.sort((a, b) => {
            return new Date(b.orderedDate) - new Date(a.orderedDate);
          });

          // Filter the data on the client side based on status1 === 1
          const filteredData = sortedData.filter((item) => item.status1 === 1);
          setCartItems(filteredData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user]);

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };


  const filterByStatus = (status) => {
    setStatusFilter(status);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredData = () => {
    let filteredData = cartItems;

    // Filter by status
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter((item) => item.status2.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by search term (product_name)
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter((item) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return filteredData;
  };


  const isCustomer = user && user.role === 'Customer';

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  // const [pid, setpid] = useState("");

  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        onClick={() => handleRatingChange(index + 1)}
        className={index + 1 <= rating ? 'active' : ''}
      >
        &#9733;
      </span>
    ));
  };

    const handleReviewSubmit = (p_id, c_id) => {
      setSubmittingReview(true);
      const newdata = { name: user?.name, p_id: p_id, stars: rating, text: reviewText, date: getCurrentDate(), c_id: c_id };
    
      axios.post(`${base_url}/api/reviewsdata`, newdata)
        .then(res => {
          // Update the reviews state with the new review
          setReviews(prevReviews => [...prevReviews, newdata]);
    
          toast.success('Thanks for your Feedback');
          console.log("Review submitted successfully");
        })
        .catch(err => {
          console.error("Error submitting review:", err);
        })
        .finally(() => {
          setSubmittingReview(false);
          setRating(0);
          setReviewText("");
        });
    };
    


  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${base_url}/api/fetchreview`)
      .then(res => {
        // const filteredReviews = res.data.filter(item => item.p_id === productId);
  
        // Sort the reviews based on the date property in descending order
        // const sortedReviews = filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        
          setReviews(res.data);
    
  
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        // setError("Error fetching review details");
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
        <Header2 />
      </div> */}
      <div className="body_cart">
        <div className="sidebar_web">
          <ul>
          <Link to='/'><img src={Logo} style={{ height: "140px" , marginBottom:'40px',marginTop:'-40px ' }} /></Link>
            <li> <Link to={'/userprofile'}>Profile</Link></li>
            <li><Link to={"/userprofilecart"}>Ordered Data</Link></li>
            {!isCustomer && <li><Link to={"/userprofileproduct"}>Uploaded Data</Link></li>}
            <li> <Link to={"/userprofile/profile"}>Update Profile</Link></li>
          </ul>
          <div className='verify-btn3'>
          <button className="verify-btn2" onClick={logoutUser}>
        Logout
      </button> </div> 
        </div>
        <div className="main-container">
          <div className="filters filters_ww">
            <label>Status Filter:</label>
            <select style={{borderRadius:'8px'}} value={statusFilter} onChange={(e) => filterByStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
            </div>
            <div className="search-bar search-bar_ww">
            <label>Search : </label>
            <input  type="text" value={searchTerm} onChange={handleSearch} placeholder="Enter product name" /></div>
          

          {getFilteredData().map((item) => (
            <div key={item._id}>
              <div className="table">
                <table className='table_cart'>
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>NAME</th>
                      <th>QUANTITY</th>
                      <th>PRICE</th>
                      <th>ACTUAL PRICE</th>
                      <th>YOU SAVED</th>
                      <th>ORDERED DATE</th>
                      <th>STATUS</th>
                      <th >{item.status2 && item.status2.toUpperCase()} DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{item.orderId}</td>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>&#8377;{(item.product_mrp * (1 - item.offer / 100) * item.quantity).toFixed(2)}</td>
                      <td>&#8377; {(item.product_mrp * item.quantity).toFixed(2)}</td>
                      <td>&#8377; { ((item.product_mrp * item.quantity).toFixed(2)-(item.product_mrp * (1 - item.offer / 100) * item.quantity).toFixed(2)).toFixed(2) }</td>
                      <td><strong>{new Date(item.date).toLocaleDateString()}</strong></td>
                      <td>{item.status2}</td>
                      <td><strong>{item.delivereddate ? new Date(item.delivereddate).toLocaleDateString() : new Date(item.date).toLocaleDateString()}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="content">
                <p className={`status_${item.status2.toLowerCase()}`}>
                  {item.status2 === 'Confirmed' && (
                    <>
                      YOUR ORDER IS <u>CONFIRMED</u> {new Date(item.date).toLocaleDateString()} AND WILL BE DELIVERED BY{' '}
                      <strong>{new Date(item.date).addDays(10).toLocaleDateString()}</strong>.
                    </>
                  )}
                  {item.status2 === 'Shipped' && (
                    <>
                      YOUR ORDER IS <u>SHIPPED</u> ON {new Date(item.delivereddate).toLocaleDateString()} AND WILL BE DELIVERED BY{' '}
                      <strong>{new Date(item.delivereddate).addDays(4).toLocaleDateString()}</strong>.
                    </>
                  )}
                  {item.status2 === 'Delivered' && (
                    <> YOUR ORDER IS <u>DELIVERED</u> ON {new Date(item.delivereddate).toLocaleDateString()}. THANK YOU SO MUCH!</>
                  )}
                  {item.status2 === 'Rejected' && (
                    <>
                      YOUR ORDER HAS BEEN <u>REJECTED</u> ON {new Date(item.delivereddate).toLocaleDateString()} . WE WILL NOT REPEAT IT AGAIN.(Note: if you pay money in cash on delivery You money will be refund to your bank)
                    </>
                  )}
                </p>
                <p className="payment_ww"><strong style={{color:'black'}}>PAYMENT MODE :</strong> {item.Payment_Type}</p>
                <div>
                  <p className="address_ww">ADDRESS-</p>
                  <ul className="address-list_ww">
                    <li><strong style={{color:'red'}}></strong>  {user?.address}, <strong style={{color:'red'}}></strong>  {user?.state}, <strong style={{color:'red'}}></strong>  {user?.pincode}</li>
                  </ul>
                </div>
              </div>
             <div>
             {item.status2 === 'Delivered' && !reviews.some(review => review.c_id === item._id && review.name === user?.name ) && (
              <div className="review-container">
                <h3 style={{textAlign:'center'}}>Write a Review for {item.product_name}</h3>
                <div className="rating-section">
                  <div className="stars">
                    <span className="ratingname">Rating: </span>
                    
                    {renderStars()}
                  </div>
                </div>
                <div>
                  {/* <label>Review: </label> */}
                  <input
                  placeholder='Review'
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="review"
                  />
                </div>
                {/* <input style={{display:'none'}} type="text" value={item.p_id} />         */}
                  <button
                  onClick={() => handleReviewSubmit(item.p_id,item._id)}
                  disabled={submittingReview || rating === 0}
                  className="submit-btn"
                >
                  Submit Review
                </button>
              </div>
            )}
             </div>

            </div>
            
          ))}
        </div>
      </div>

    </>
  );
}

export default UserProfileCart;
