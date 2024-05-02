import React, { useEffect, useState } from "react";
import axios from "axios";
import './product_details.css'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeftCircle } from "react-icons/hi2";
import { RiArrowRightCircleFill } from "react-icons/ri";

import Header2 from '../components/header/Header2';
import Footer from "../components/footer/Footer"
import { base_url } from '../utils/config';


const ProductDetail = () => {
  
  const navigate = useNavigate();

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  

 


  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    axios.get(`${base_url}/api/products`)
      .then(res => {
        const filteredProduct = res.data.find(item => item._id === productId);
        setProduct(filteredProduct);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setError("Error fetching product details");
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    axios.get(`${base_url}/api/fetchreview`)
      .then(res => {
        const filteredReviews = res.data.filter(item => item.p_id === productId);
        const sortedReviews = filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sortedReviews.length >= 0) {
          setReviews(sortedReviews);
        } else {
          setError("Reviews not found for the specified product");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setError("Error fetching review details");
        setLoading(false);
      });
  }, [shouldRefresh, productId]);



 

  const handleAddToCart = async (product) => {
    try {
      const userEmail = user ? user.email : null;
  
      if (!userEmail) {
        console.error("User email is undefined or null");
        return;
      }
  
      const response = await axios.get(`${base_url}/api/cart?email=${userEmail}`);
      const userCartItems = response.data;
  
      const isProductInCartWithStatus = (productName) => {
        return userCartItems.some((item) => item.product_name === productName && item.status1 === 0);
      };
  
      if (!isProductInCartWithStatus(product.product_name)) {
        const newProduct = {
          p_id: product._id,
          product_name: product.product_name,
          product_mrp: product.product_mrp,
          product_selling_price: product.product_selling_price,
          offer: product.offer,
          product_type: product.product_type,
          quantity: 1,
          email: userEmail,
          status1: 0,
          product_img: product.product_img
        };
  
        await axios.post(`${base_url}/api/addToCart`, newProduct);
        toast.success("Item added to cart");
      } else {
        toast.error("Item is already in the cart");
      }
    } catch (error) {
      console.error("Error handling cart:", error);
      toast.error("Failed to handle cart");
    }
  };

  const calculateAverageStars = () => {
    if (reviews.length === 0) {
      return 0;
    }
  
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const averageStars = totalStars / reviews.length;
    return averageStars.toFixed(1);
  };


  const sliderImages = [
    {
      url: product?.product_img || (product?.product_images && product?.product_images.length > 0 ? `data:image/png;base64,${product.product_images[0].data}` : null)
    },
    {
      url: product?.product_img || (product?.product_images && product?.product_images.length > 0 ? `data:image/png;base64,${product.product_images[1].data}` : null)
    },
    {
      url: product?.product_img || (product?.product_images && product?.product_images.length > 0 ? `data:image/png;base64,${product.product_images[2].data}` : null)
    }
  ];
  
 const [activeImageNum, setCurrent] = useState(0);
 const length = sliderImages.length;
 const nextSlide = () => {
    setCurrent(activeImageNum === length - 1 ? 0 : activeImageNum + 1);
 };
 const prevSlide = () => {
    setCurrent(activeImageNum === 0 ? length - 1 : activeImageNum - 1);
 };
 if (!Array.isArray(sliderImages) || sliderImages.length <= 0) {
    return null;
 }
  

  return (
    <>
      <div style={{position:'fixed', width:'100%', zIndex:'9999', top:'0' }}>
        <Header2/>
      </div>

      <div className="casrd-wrapper">
       
          {/* card left */}
          <section className = "image-slider">
            <div class = "left">
            <HiArrowLeftCircle onClick = {prevSlide} />

              {/* <div onClick = {prevSlide}>F</div> */}
                 
            </div>
            <div class="right"> 
            <RiArrowRightCircleFill onClick = {nextSlide}/>

              
            </div>
            {sliderImages.map((currentSlide, ind) => {
               return (
                  <div
                     className={ind === activeImageNum ? "currentSlide active" : "currentSlide"}
                     key={ind}
                  >
                     {ind === activeImageNum && <img src={currentSlide.url} className="image" />}
                  </div>
               );
            })}
         </section>
         
          {/* card right */}
          <div className="product-content">
            <h2 className="product-title">{product?.product_name}</h2>
            <div className="product-rating">
            {[...Array(5)].map((_, index) => (
        <i key={index} className={`fas fa-star${index < calculateAverageStars() ? '' : '-half-alt'}`}></i>
        ))}
        <span>{calculateAverageStars()} ({reviews.length})</span>

            </div>
            <div className="product-price">
              <p className="last-price">Old Price: <span>&#8377;{product?.product_mrp}</span></p>
              <p className="new-price">New Price: <span>&#8377;{(product?.product_mrp * (1 - product?.offer / 100)).toFixed(2)} ({product?.offer}%)</span></p>
              <p className="new-price">Pack off: <span>{product?.quantity}</span></p>
            </div>
            <div className="product-detail">
              <h2 style={{fontSize:'22px'}}>About this item: </h2>
              <p>{product?.discription}</p>
            </div>
            <div className="purchase-info">
              <button type="button" className="btn" onClick={() => handleAddToCart(product)}>
                Add to Cart <i className="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
        {reviews.length > 0 ? (
  <div className="reviews-section_1">
    <h2 style={{ textAlign: 'center' }}>Customer Reviews</h2>
    {reviews.map((review, index) => (
      <div className="review_1" key={index}>
        <div className="review-content_1">
          <div style={{ marginLeft: '82rem' }} className="date_add_review">{review.date}</div>

          <div className="product-rating_1">
            Rating: {Array.from({ length: 5 }, (_, i) => (
              <i key={i} className={`fas fa-star${i + 1 <= review.stars ? '' : '-half-alt'}`}></i>
            ))}
          </div>
          <h4> Name: {review.name}</h4>
          <h5> Review: {review.text}</h5>
        </div>
      </div>
    ))}
  </div>
) : (
<div>
  <h2 style={{ textAlign: 'center' }}>Customer Reviews</h2>
  <div className="no-reviews">
    <p>No reviews available for this product.</p>
  </div>
  </div>
)}

      <ToastContainer />
      {/* Assuming Footer is a component you want to render at the end */}
      <Footer />
    </>
  );
};

export default ProductDetail;
