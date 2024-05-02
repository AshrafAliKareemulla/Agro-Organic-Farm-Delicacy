import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/Header' 
import Footer from '../../components/footer/Footer'
// import "./Orders.css"
export function Orders() {
  return (
    <>
    <Header/>
    <div className="main">
    <div className="LeftSection">
    <ul style={{textDecoration:"none"}}>
    <li><Link to={"/orders"}>Orders</Link></li>
        <li><Link to={"/overview"}>Overview</Link></li>
        <li><Link to={"/returnitems"}>Returned Items</Link></li>
        <li><Link to={"/returns"}>Return an Item</Link></li>
        {/* <li><Link to={"/personaldetails"}>Personal Details</Link></li> */}
    </ul>
    </div>
    <div className='RightSection'>
        <h1>Orders</h1>
        <ul style={{textDecoration:"none"}}>
            <table>
                <tr>
                <th>Order</th>
                <th>Date Ordered</th>
                <th>Details</th>
                </tr>
                <td>Order No:123456</td>
                <td>20/7</td>
                <td>View Details</td>
                <tr>
               
                </tr>
                <td>Order No:123456</td>
                <td>20/7</td>
                <td>View Details</td>
                <tr>
                </tr>
                <td>Order No:123456</td>
                <td>20/7</td>
                <td>View Details</td>
                <tr>
                </tr>
                <td>Order No:123456</td>
                <td>20/7</td>
                <td>View Details</td>
                <tr>
                </tr>
                <td>Order No:123456</td>
                <td>20/7</td>
                <td>View Details</td>
                <tr>
                </tr>
                <td>Order No:123456</td>
                <td>20/7</td>
                <td>View Details</td>
            </table>
      
    </ul>
    </div>
    </div>
    <Footer/>
    </>
  )
}

export default Orders;
