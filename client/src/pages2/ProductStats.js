import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './productstats.css';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { SiProducthunt } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { FaCartShopping } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
import { base_url } from '../utils/config';


function ProductStats() {
    const [cartdata, setCartData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const chartRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${base_url}/api/cartdata`)
            .then(res => {
                setLoading(false);
                const allData = res.data.filter(item => item.status1 === 1); // Filter only status1 products
                setCartData(allData);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
                setError(err);
            });
    }, []);

    useEffect(() => {
        if (cartdata) {
            createChart();
        }
    }, [cartdata, selectedMonth]);

    const createChart = () => {
        const filteredData = selectedMonth ? cartdata.filter(item => item.date.includes(selectedMonth)) : cartdata;

        // Aggregate quantities for each product name
        const productQuantitiesMap = new Map();
        filteredData.forEach(data => {
            const { product_name, quantity } = data;
            if (productQuantitiesMap.has(product_name)) {
                productQuantitiesMap.set(product_name, productQuantitiesMap.get(product_name) + quantity);
            } else {
                productQuantitiesMap.set(product_name, quantity);
            }
        });

        // Sort the product names based on their quantities in descending order
        const sortedProductNames = Array.from(productQuantitiesMap.keys()).sort((a, b) => productQuantitiesMap.get(b) - productQuantitiesMap.get(a));
        // Take only the top 8 products
        const top8ProductNames = sortedProductNames.slice(0, 8);

        const productNames = [];
        const quantities = [];

        // Populate productNames and quantities arrays
        top8ProductNames.forEach(name => {
            productNames.push(name);
            quantities.push(productQuantitiesMap.get(name));
        });

        if (chartRef.current) {
            // Destroy existing chart
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('productChart');
        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productNames,
                datasets: [{
                    label: 'Quantity',
                    data: quantities,
                    backgroundColor: '#00d8d8',
                    borderColor: '#da32ed',
                    borderWidth: 1,
                    barThickness: 60,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
                    hoverBorderColor: 'rgba(75, 192, 192, 1)',
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        chartRef.current = newChart;

        // Sort the table data according to quantity after summing all quantities
        return top8ProductNames.map(name => ({
            product_name: name,
            quantity: productQuantitiesMap.get(name)
        }));
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleSort = () => {
        // Sort the table data according to quantity
        const sortedData = createChart().sort((a, b) => b.quantity - a.quantity);
        setCartData(sortedData);
    };

    const aggregateCartData = () => {
        const aggregatedData = [];
        const map = new Map();

        cartdata.forEach(item => {
            if (map.has(item.product_name)) {
                const existingItem = map.get(item.product_name);
                existingItem.quantity += item.quantity;
                map.set(item.product_name, existingItem);
            } else {
                map.set(item.product_name, { ...item });
            }
        });

        map.forEach(value => {
            aggregatedData.push(value);
        });

        return aggregatedData;
    };

    const aggregatedCartData = cartdata ? aggregateCartData() : null;

    return (
        <div className="container_pro2">
              <div className="sidebar_1">
        <Link to="/" style={{ color: 'black' }}>  <h1>Dashboard</h1> </Link>
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
      <h1 className='searchbar'>Statistics Data</h1>
            {loading && <p className="loading_pro">Loading...</p>}
            {error && <p className="error_pro">Error: {error.message}</p>}
            {cartdata && (
                
                <div className="main-content_pro">
                     <div style={{marginLeft:'50rem'}} className="filter-container">
                    <label className="label_pro">Select Month:</label>
                    <select className="select_pro" onChange={handleMonthChange} value={selectedMonth}>
                        <option value="">All Months</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    </div>
                    <canvas className="userchat userchat200" id="productChart" width="200" height="200"></canvas>
                    <div className='table2'>
    <table className="data-table_pro">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            {aggregatedCartData.map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td>{data.product_name}</td>
                    <td>{data.quantity}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

                </div>
            )}
             <div style={{marginLeft:'15.5rem'}} className='Footer'>
         
         &copy; {} All Rights Reserved
        
     </div>
        </div>
    );
    
}

export default ProductStats;
