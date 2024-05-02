import React, { useState, useEffect } from 'react';
import './admin.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { SiProducthunt } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import { FaCartShopping } from "react-icons/fa6";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../components/loader/Loader"
import { ImStatsBars } from "react-icons/im";
import { base_url } from '../utils/config';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // Fetch products from Solr based on searchTerm
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://solr-server:8983/solr/products/select?q=${searchTerm}`);
        setProductData(response.data.response.docs);
        setLoading(false);
        setSearching(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        setSearching(false);
      }
    };

    if (searching) {
      fetchData();
    }
  }, [searchTerm, searching]);

  useEffect(() => {
    // Fetch initial products from your API
    axios.get(`${base_url}/api/products`)
      .then(res => {
        setProductData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleSelect = (productId) => {
    setLoading(true);
    const updatedProducts = productData.map((product) => {
      if (product._id === productId) {
        return { ...product, selected: "1" };
      }
      return product;
    });

    axios
      .put(`${base_url}/api/selecteditem/${productId}`,{selected:"1"})
      .then((res) => {
        setProductData(updatedProducts);
        setTimeout(() => {
          setLoading(false); 
        }, 500);
        toast.success('Product Successfully Uploaded');
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false); // Set loading state to false after the request is complete
      });
  };

  const handleReject = (productId) => {
    setLoading(true);

    axios
      .delete(`${base_url}/api/rejectitem/${productId}`)
      .then(() => {
        const updatedProducts = productData.filter((product) => product._id !== productId);
        setProductData(updatedProducts);
        setTimeout(() => {
          setLoading(false); 
        }, 500);
        toast.error('Product Rejected');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    setSearching(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearching(true);
    }
  };

  const countAcceptedProducts = () => {
    const acceptedProducts = productData.filter(product => product.selected === '0');
    return acceptedProducts.length;
  };

  const acceptedProductsCount = countAcceptedProducts();

  const filteredProducts = productData.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortBySelected = (a, b) => {
    if (a.selected === '0' && b.selected === '1') {
      return -1; // '0' comes before '1', so '0' should appear first
    } else if (a.selected === '1' && b.selected === '0') {
      return 1; // '1' comes after '0', so '1' should appear after '0'
    } else {
      return 0; // Maintain the existing order for other cases
    }
  };

  const sortedProducts = [...filteredProducts].sort(sortBySelected);

  return (
    <div className='products_1'>
      <div className="sidebar_1">
        <a href="/">  <h1>Dashboard</h1> </a>
        <ul>
          <li> <Link to={'/admin'}><IoMdHome /> Home</Link></li>
          <li> <Link to={"/admin/users"}><FaUsers /> Users</Link></li>
          <li><Link to={"/admin/product"}> <SiProducthunt /> Products   </Link></li>
          {/* <span className='countp'>{acceptedProductsCount}</span>  */}
          <li><Link to={"/admin/feedbacks"}> <VscFeedback />Complaints</Link></li>
          <li><Link to={"/admin/cartdata"}> <FaCartShopping /> Cart Data</Link></li>
          <li><Link to={"/productstas"}> <ImStatsBars /> Statistics</Link></li>
          <li><Link to={"/"}><CiLogout /> Logout</Link></li>
        </ul>
      </div>
      <h1 className='searchbar'>Product Details</h1>
      
      {/* Solr search input */}
      <input className='search_2'
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress} // Call handleKeyPress function when a key is pressed
      />
      
      {/* Search button */}
      {/* <button className="search_button" onClick={handleSearch}>Search</button> */}
      
      <h2>Products</h2>
      <div className="product_cards">
        {sortedProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <p className='str'><strong>Name:</strong> {product.product_name}</p>
            <p style={{ cursor: 'pointer' }} className='str'><strong>Image:</strong>
              {product && product.product_img ? (
                <Link to={product.product_img} target="_blank">Click here</Link>
              ) : product && product.product_images && product.product_images.length > 0 ? (
                <Link to={`data:image/png;base64,${product.product_images[0].data}`} target="_blank">Click here</Link>
              ) : (
                <span>No Image</span>
              )}
            </p>
            <p className='str'><strong>Price:</strong> {parseFloat(product.product_mrp).toFixed(2)}</p>
            <p className='str'><strong>Selling Price:</strong> {parseFloat((product.product_mrp * (1 - product.offer / 100)).toFixed(2)).toFixed(2)}</p>
            <p className='str'><strong>Quantity:</strong> {product.quantity}</p>
            <p className='str'><strong>Offer: </strong> {parseFloat(product.offer).toFixed(2)}%</p>
            {product.selected === "1" ? (
              <button className='btse'>Selected</button>
            ) : (
              <>
                <button className='btse' onClick={() => handleSelect(product._id)}>Accept</button>
                <button className='btre' onClick={() => handleReject(product._id)}>Reject</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className='Footer'>
        &copy; {} All Rights Reserved
      </div>
      <div className='loader_in'>{loading && <Loader />}</div>
    </div>
  );
}

export default Products;
