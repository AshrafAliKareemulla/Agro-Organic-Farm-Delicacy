import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './admin.css';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { SiProducthunt } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { FaCartShopping } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
import { base_url } from '../utils/config';

function Admin() {
  const [productData, setProductData] = useState([]);
  const [cartdata, setcartdata] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [usersData, setUsersData] = useState(null);

  useEffect(() => {
    axios.get(`${base_url}/api/products`)
      .then(res => {
        const selectedProducts = res.data.filter(product => product.selected === "1");
        setProductData(selectedProducts);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get(`${base_url}/api/cartdata`)
      .then(res => {
        const filteredData = res.data.filter(item => item.status1 === 1);
        setcartdata(filteredData);
        
      })
      .catch(err => {
        console.log(err);
        setError(err);
      });
  }, []);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data.json');
        setProductData(response.data.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    axios.get(`${base_url}/api/reviews`)
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
      });
  }, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${base_url}/api/cartdata`);
      const cartdata = response.data;

      // Filter cart data where status2 is 'Delivered'
      const deliveredItems = cartdata.filter(item => item.status2 === 'Delivered');

      // Aggregate monthly data
      const aggregatedMonthlyData = Array.from({ length: 12 }, (_, monthIndex) => {
        const monthProducts = deliveredItems.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === monthIndex;
        });

        // Calculate total money earned for the month
        const monthlyTotal = monthProducts.reduce((acc, item) => {
          const itemTotal = ((item.product_mrp * (1 - item.offer / 100)).toFixed(2) * item.quantity).toFixed(2);
          return acc + parseFloat(itemTotal);
        }, 0);

        return monthlyTotal.toFixed(2);
      });

      // Chart data and options
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthlyData = {
        labels: months,
        datasets: [{
          label: 'Total Money Earned (Monthly)',
          data: aggregatedMonthlyData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: '#007bff',
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: false,
        }]
      };

      // Get the context once the ref is available
      const ctxMonthly = chartRefMonthly.current?.getContext('2d');
      if (ctxMonthly) {
        if (chartInstanceMonthly.current) {
          chartInstanceMonthly.current.destroy();
        }

        chartInstanceMonthly.current = new Chart(ctxMonthly, {
          type: 'line',
          data: monthlyData,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.raw || '';
                    return `${label}: ₹ ${value}`;
                  },
                },
              },
            },
          }
        });
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  fetchData();
}, []);

  

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${base_url}/api/home12`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const jsonData = await response.json();
        setUsersData(jsonData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);


  const chartRef1 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartRefPie = useRef(null);
  const chartInstancePie = useRef(null);
  const chartRefRoles = useRef(null);
  const chartInstanceRoles = useRef(null);
  const chartRefMonthly = useRef(null);
  const chartInstanceMonthly = useRef(null);

  useEffect(() => {
    const aggregatedStatus = {};
    if (cartdata) {
      cartdata.forEach(item => {
        const { status2 } = item;
        if (aggregatedStatus[status2]) {
          aggregatedStatus[status2] += 1;
        } else {
          aggregatedStatus[status2] = 1;
        }
      });
    }
  
    const statusLabels = Object.keys(aggregatedStatus);
    const statusCounts = Object.values(aggregatedStatus);
  
    const statusOptions = {
      Confirmed: { label: 'Confirmed', color: 'rgba(255, 99, 132, 0.5)' }, // Red
      Shipped: { label: 'Shipped', color: 'rgba(54, 162, 235, 0.5)' }, // Blue
      Delivered: { label: 'Delivered', color: 'rgba(75, 192, 192, 0.5)' }, // Teal
      Rejected: { label: 'Rejected', color: 'rgba(255, 206, 86, 0.5)' }, // Yellow
    };
  
    const statusData = {
      labels: statusLabels.map(status => statusOptions[status]?.label || status),
      datasets: [{
        label: 'Order Status',
        data: statusCounts,
        backgroundColor: statusLabels.map(status => statusOptions[status]?.color || 'rgba(0, 0, 0, 0.5)'),
        borderColor: 'rgba(255, 255, 255, 1)', // White border
        borderWidth: 1,
        hoverOffset: 4
      }]
    };
  
    const ctxPie = chartRefPie.current.getContext('2d');
    if (chartInstancePie.current) {
      chartInstancePie.current.destroy();
    }
  
    chartInstancePie.current = new Chart(ctxPie, {
      type: 'pie',
      data: statusData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 1,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || '';
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });
  
    return () => {
      if (chartInstancePie.current) {
        chartInstancePie.current.destroy();
      }
    };
  }, [cartdata]);
  

  useEffect(() => {
    const aggregatedData = {};

    if (productData) {
      productData.forEach(product => {
        if (
          product.product_type === 'Fruit' ||
          product.product_type === 'HTP Machines' ||
          product.product_type === 'Dairy/Meat' ||
          product.product_type === 'Vegetable' ||
          product.product_type === 'Seeds' ||
          product.product_type === 'Organic Fertilizer'
        ) {
          if (aggregatedData[product.product_type]) {
            aggregatedData[product.product_type] += 1;
          } else {
            aggregatedData[product.product_type] = 1;
          }
        }
      });
    }
    

    const productLabels = Object.keys(aggregatedData);
    const productQuantities = Object.values(aggregatedData);

    const usersData = {
      labels: productLabels,
      datasets: [{
        label: 'Product Types',
        data: productQuantities,
        backgroundColor: '#00d8d8', // Darker color
        borderColor: '#da32ed', // Darker color
        borderWidth: 1, // Adjust the width of the border
        barThickness: 50, // Adjust the width of the bar
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.7)', // Darker color
        hoverBorderColor: 'rgba(54, 162, 235, 1)', // Darker color
      }]
    };
    
    const ctx = chartRef1.current.getContext('2d');

    if (chartInstance1.current) {
      chartInstance1.current.destroy();
    }

    chartInstance1.current = new Chart(ctx, {
      type: 'bar',
      data: usersData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartInstance1.current) {
        chartInstance1.current.destroy();
      }
    };
  }, [productData]);

  useEffect(() => {
    const aggregatedRoles = {};
    if (usersData) {
      usersData.forEach(user => {
        const { role } = user;
        if (aggregatedRoles[role]) {
          aggregatedRoles[role] += 1;
        } else {
          aggregatedRoles[role] = 1;
        }
      });
    }
  
    const roleLabels = Object.keys(aggregatedRoles);
    const roleCounts = Object.values(aggregatedRoles);
  
    const rolesData = {
      labels: roleLabels,
      datasets: [{
        label: 'User Roles',
        data: roleCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }]
    };
  
    const ctxRoles = chartRefRoles.current.getContext('2d');
  
    if (chartInstanceRoles.current) {
      chartInstanceRoles.current.destroy();
    }
  
    chartInstanceRoles.current = new Chart(ctxRoles, {
      type: 'pie', // Change chart type to pie
      data: rolesData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    return () => {
      if (chartInstanceRoles.current) {
        chartInstanceRoles.current.destroy();
      }
    };
  }, [usersData]);
  


  const calculateTotalPrice = () => {
    let subtotal = 0;
  
    // Check if cartdata is not null before filtering
    if (cartdata) {
      // Calculate subtotal for all items with status2 'Delivered' in the cart
      const deliveredItems = cartdata.filter(item => item.status2 === 'Delivered');
      deliveredItems.forEach((item) => {
        subtotal += (item.product_mrp * (1 - item.offer / 100)).toFixed(2) * item.quantity;
      });
    }
  
    const total = subtotal;
  
    return {
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
    };
  };
  

  return (
    <div className="dashboard-container Admins">
      <div className="sidebar_1">
        <Link to="/" style={{ color: 'white' }}>  <h1>Dashboard</h1> </Link>
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
      <div className="content_15">
        <div className="card_151">
          <p className='ic'><FaUsers /> </p>
          <h2>Users</h2>
          <p>Total users: {usersData ? usersData.length : 0}</p>
        </div>
        <div className="card_152">
          <p className='ic'> <SiProducthunt /> </p>
          <h2>Products</h2>
          <p>Total Products : {productData ? productData.length :0}</p>
        </div>
        <div className="card_154">
        <p className='ic'><FaCartShopping /> </p>
        <h2>Delivered </h2>
        <p>Total Products: {cartdata ? cartdata.filter(item => item.status2 === 'Delivered').length : 0}</p>
        <p>Total Earned: &#8377;{calculateTotalPrice().subtotal}</p>
      </div>


        <div className="card_153">
          <p className='ic'><VscFeedback /> </p>
          <h2>Feedbacks</h2>
          <p>Total Feedbacks : {posts ?  posts.length : 0} </p>
        </div>
      </div>
      <div className="graph-container">
        <canvas className="userchat" id="userChart1" ref={chartRef1}></canvas>
        <canvas className="userchat2" id="userChartRoles" ref={chartRefRoles}></canvas>
      </div>
      <div className="graph-container">
        {/* <h2>User Roles</h2> */}
        <canvas className="userchat10" id="userChartMonthly" ref={chartRefMonthly}></canvas>
        <canvas className="graph23" id="userChartPie" ref={chartRefPie}></canvas>
      </div>
      <div className='Footer'>
        &copy; 2024 All Rights Reserved
      </div>
    </div>
  );
}

export default Admin;
