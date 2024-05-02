// CartData.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { SiProducthunt } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { FaCartShopping } from "react-icons/fa6";
import Loader from "../components/loader/Loader"
import { ImStatsBars } from "react-icons/im";
import { base_url } from '../utils/config';


function CartData() {
  const [cartdata, setcartdata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // Default filter: Show all items

  
  useEffect(() => {
    axios.get(`${base_url}/api/cartdata`)
      .then(res => {
        // Filter the data where status1 is equal to 1
        const filteredData = res.data.filter(item => item.status1 === 1);

        // Sort the data based on the 'date' property in descending order
        const sortedData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        setcartdata(sortedData);
        console.log(sortedData);
      })
      .catch(err => {
        console.log(err);
        setError(err);
      });
  }, []);

  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleStatusChange = (productId, newStatus) => {
    setLoading(true);

    const updatedstatus = cartdata.map((item) => {
      if (item._id === productId) {
        return { ...item, status2: newStatus, delivereddate: getCurrentDate() };
      }
      return item;
    });

    axios.put(`${base_url}/api/updateCartstatus/${productId}`, { status2: newStatus, delivereddate: getCurrentDate() })
      .then(() => {
        setcartdata(updatedstatus);
        setTimeout(() => {
          setLoading(false); 
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      }).finally(() => {
        setLoading(false); // Set loading state to false after the request is complete
      });
    console.log(`Updating status for product ID ${productId} to ${newStatus}`);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredCartData = cartdata && filter !== "all"
    ? cartdata.filter(item => item && item.status2 && item.status2.toLowerCase() === filter.toLowerCase())
    : cartdata;

  return (
    <div className='users_5'>
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
      <h1 className='searchbar'>Cart Data</h1>

      <div style={{marginLeft:'10rem'}} className="filter-container">
        <label style={{color:'black', padding:'6px'}}>Filter by Status: </label>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="status-filter"
        >
          <option value="all">All</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="user-cards_5">
  {filteredCartData && (
    <table className="user-table_5">
      <thead>
        <tr>
          <th>Product Id</th>
          <th>Order Id</th>
          <th>Name</th>
          <th>Product Type</th>
          <th>Quantity</th>
          <th>Email</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredCartData.map((data, index) => (
          <tr key={data?._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
            <td>{data?._id}</td>
            <td>{data?.orderId}</td>
            <td>{data?.product_name}</td>
            <td>{data?.product_type}</td>
            <td>{data?.quantity}</td>
            <td>{data?.email}</td>
            <td>{data?.date}</td>
            <td>
              {data?.status2 === "Rejected" ? (
                <span style={{ backgroundColor: 'red', padding:'12px', borderRadius:'3px' }}>{data?.status2}</span>
              ) : data?.status2 === "Delivered" ? (
                <span style={{ backgroundColor: 'green' ,padding:'12px', borderRadius:'3px' }}>{data?.status2}</span>
              ) : (
                <select
                  value={data?.status2}
                  onChange={(e) => handleStatusChange(data?._id, e.target.value)}
                  className="status-dropdown_5"
                >
                  {data?.status2 !== "Shipped" && <option value="Confirmed">Confirmed</option>}
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

      <div style={{marginLeft:'31rem'}} className='Footer'>
         
         &copy; {} All Rights Reserved
        
     </div>
     <div className='loader_in'>{loading && <Loader />}</div>

    </div>
  );
}

export default CartData;
