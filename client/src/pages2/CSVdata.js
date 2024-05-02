import React, {  useEffect } from 'react';
// import './css/Sales_Agent_Home_CSS_Styles.css';
import './csv.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header2 from '../components/header/Header2';
import Footer from "../components/footer/Footer"
import { base_url } from '../utils/config';



function CSVdata() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (user === null) {
        dispatch(getUser());
      }
    }, [dispatch, user]);

    function getCurrentDate() {
      const currentDate = new Date();
      
      // Get the current date in the format YYYY-MM-DD
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const name = document.getElementById("name").value;
    const files = document.getElementById("files").files;
    const formData = new FormData();
    // formData.append("name", name);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
      formData.append("email", user?.email);
      formData.append("date", getCurrentDate());

    }
    try {
      console.log("Hello All");
      const response = await fetch(`${base_url}/api/take_csv_form`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      toast.success('CSV data added successfully ')
      toast.success('CSV data Uploaded to Admin ')
      navigate('/sales')
    } catch (error) {
      console.error('Error:', error);
    }
  };





  return (
    <>
    <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
      <Header2 />
    </div>
    <div>
      <div className='csv_container'>
      <p style={{fontWeight:'bold' , fontSize:'1.5rem', color:'orange'}}>
        Find the screenshot of the <strong style={{fontSize:'1.7rem'}}>CSV Data</strong> on how to upload the data in the csv file.</p>
        
      <p style={{fontSize:'1rem',color:'black'}}> 
The content describes a CSV file structure with eight columns representing Product Name, Image link, MRP, Selling Price, Quantity, Offer, Delivery Charges, Product Type, and a ninth column for the Description of the product. Each column serves as a specific attribute for organizing and managing product data.
      </p>

      <br />
      
      <img className='csvimg' src={require('../Images/csv.png')} alt="CSV Image" />
      
      <p >
        <strong style={{color:'red'}}>Remember</strong> to follow the specific syntax for each and every column. And submit the file that just looks like in the
        screenshot above.
      </p>

      <br />

      <div className="csv_form">
        <div className="cc1"> Upload Your CSV File Here   </div>
        {/* <div className="cc2"> Submit the File : </div> */}
        <form onSubmit={handleSubmit}>
          
          <input  id="files" name="file" type="file" multiple />
          <button style={{ cursor: 'pointer' }} type="submit" className="csv_submit"> Submit </button>
        </form>
        
      </div>
      </div>
      <ToastContainer />
    </div>
    <Footer/>
    </>
  );
}

export default CSVdata;
