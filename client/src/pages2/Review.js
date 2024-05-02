import React, { useState, useEffect } from 'react';
import './admin.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { SiProducthunt } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { FaCartShopping } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
import { base_url } from '../utils/config';


function ReviewPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${base_url}/api/reviews`)
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => {
        console.error(err); // Log errors to the console
      });
  }, []);

  // Function to open a mailto link in a new tab or window
  const openMail = (emailAddress) => {
    window.open(`mailto:${emailAddress}?subject=Question`, '_blank');
  };

  const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const formatDate = (date) => {
    return date ? date.slice(0, 10) : '';
  };

  return (
    <div className='Reviews'>
      <div className="sidebar_1">
        <a href="/"> <h1>Dashboard</h1> </a>
        <ul>
          <li> <Link to={'/admin'}><IoMdHome /> Home</Link></li>
          <li> <Link to={"/admin/users"}><FaUsers /> Users</Link></li>
          <li><Link to={"/admin/product"}> <SiProducthunt /> Products</Link></li>
          <li><Link to={"/admin/feedbacks"}> <VscFeedback />Complaints</Link></li>
          <li><Link to={"/admin/cartdata"}> <FaCartShopping /> Cart Data</Link></li>
          <li><Link to={"/productstas"}> <ImStatsBars /> Statistics</Link></li>
          <li><Link to={"/"}><CiLogout /> Logout</Link></li>
        </ul>
      </div>

      <h1 className='searchbar'>Customer Complaints</h1>

      <div className="feedback-container">
        {sortedPosts.map(post => (
          <div className="feedback-card str1" key={post.p_id}>
            <h2>{post.feedback}</h2>
            <p className="feedback-date str1">{formatDate(post.timestamp)}</p>
            <p className="feedback-name">-{post.name}</p>
            <p style={{cursor:'pointer'}} className="feedback-name">
              <a onClick={() => openMail(post.email)}>{post.email}</a>
            </p>
          </div>
        ))}
      </div>

      <div className='Footer'>
        &copy; 2024 All Rights Reserved
      </div>
    </div>
  );
}

export default ReviewPage;