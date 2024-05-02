import React, { useState, useEffect } from 'react';
import './userprofileproduct.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import Header2 from '../components/header/Header2';
import axios from 'axios';
import { RESET_AUTH, logout } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Logo from "./register.png";
import { base_url } from '../utils/config';



const UserProfileProduct = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('all'); // Default to 'all'

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${base_url}/api/products`)
        .then((res) => {
          const selectedProducts = res.data.filter((product) => product.email === user?.email);
          setCartItems(selectedProducts);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user]);

  const filterByProductType = (type) => {
    setProductTypeFilter(type);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredData = () => {
    let filteredData = cartItems;

    if (productTypeFilter !== 'all') {
      filteredData = filteredData.filter((item) => item.product_type.toLowerCase() === productTypeFilter.toLowerCase());
    }

    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter((item) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return filteredData.reverse();
  };

  const getApprovalStatus = (selected) => {
    return selected === '1' ? 'Approved' : 'Not Approved At';
  };

  const isCustomer = user && user.role === 'Customer';

  const [reviews, setReviews] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    axios.get(`${base_url}/api/fetchreview`)
      .then(res => {
        const sortedReviews = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews(sortedReviews);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
      });
  }, []);

  const handleReviewToggle = (productId) => {
    setSelectedProductId((prevId) => (prevId === productId ? null : productId));
  };

  return (
    <>
      {/* <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
        <Header2 />
      </div> */}
      <div className="body_cart">
        <div className="sidebar_web">
          <ul>
          <Link to='/'><img src={Logo} style={{ height: "140px" , marginBottom:'40px',marginTop:'-40px ' }} /></Link>

            <li><Link to={'/userprofile'}>Profile</Link></li>
            <li><Link to={"/userprofilecart"}>Ordered Data</Link></li>
            {!isCustomer && <li><Link to={"/userprofileproduct"}>Uploaded Data</Link></li>}
            <li><Link to={"/userprofile/profile"}>Update Profile</Link></li>
          </ul>
          <div className='verify-btn3'>
            <button className="verify-btn2" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>
        <div className="main-container_p">
          <div className="filters filters_ww">
            <label style={{ marginLeft: '44rem' }}>Product Type Filter:</label>
            <select style={{ borderRadius: '8px' }} value={productTypeFilter} onChange={(e) => filterByProductType(e.target.value)}>
              <option value="all">All</option>
              <option value="Fruit">Fruit</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Dairy/Meat">Dairy/Meat</option>
            </select>
          </div>
          <div className="search-bar search-bar_ww">
            <label>Search:</label>
            <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Enter product name" />
          </div>

          {getFilteredData().map((item) => (
            <div key={item._id}>
              <div className="table_1">
                <table className='table_cart_p'>
                  <thead>
                    <tr>
                      <th>IMAGE</th>
                      <th>NAME</th>
                      <th>PRICE</th>
                      <th>OFFER</th>
                      <th>PACK OFF</th>
                      <th>PRODUCT TYPE</th>
                      <th>STATUS</th>
                      <th>REVIEW</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {item && item.product_img ? (
                          <img
                            src={item.product_img}
                            alt={item.product_name}
                            style={{ width: '50px', height: '50px', borderRadius: '6px' }}
                          />
                        ) : item && item.product_images && item.product_images.length > 0 ? (
                          <img
                            src={`data:image/png;base64,${item.product_images[0].data}`}
                            alt={item.product_name}
                            style={{ width: '50px', height: '50px', borderRadius: '6px' }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td>{item.product_name}</td>
                      <td>{item.product_mrp}</td>
                      <td>{item.offer}% Off</td>
                      <td>{item.quantity}</td>
                      <td>{item.product_type}</td>
                      <td style={{ color: item.selected === '1' ? 'green' : 'black', fontWeight: 'bold' }}>{getApprovalStatus(item.selected)}</td>
                      <td>
                      <button className="review-button" onClick={() => handleReviewToggle(item._id)}>
                      {selectedProductId === item._id ? 'Hide Reviews' : 'Show Reviews'}
                    </button>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {selectedProductId === item._id && (
                <div className="review_box">
                  {reviews
                    .filter((review) => review.p_id === item._id)
                    .map((review) => (
                      <div key={review._id} className="review-item_1">
                        <div className="review-user_1">{review.name}</div>
                        <div className="review-stars_1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i + 1 <= review.stars ? 'active' : ''}>
                              &#9733;
                            </span>
                          ))}
                        </div>
                        <div className="review-text_1">{review.text}</div>
                        <span className="date_add_review_1">{review.date}</span>
                      </div>
                    ))}
                  {reviews.filter((review) => review.p_id === item._id).length === 0 && (
                    <div key={`no-reviews-${item._id}`} className="review-item_1">
                      <div className="review-user_1">No reviews yet</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserProfileProduct;
