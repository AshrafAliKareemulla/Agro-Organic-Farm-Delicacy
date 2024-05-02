import React, { useState, useEffect } from 'react';
import './form.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import axios from 'axios';
import Loader from "../components/loader/Loader"
import { base_url } from '../utils/config';



const Form = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const [product_name, setProduct_name] = useState('');
  const [product_mrp, setProduct_mrp] = useState('');
  const [quantity_available, setQuantity_available] = useState('');
  const [offer, setOffer] = useState('');
  const [delivary_charges, setDelivary_charges] = useState('');
  const [product_type, setProduct_type] = useState('');
  const [discription, setDiscription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };
  function getCurrentDate() {
    const currentDate = new Date();
    
    // Get the current date in the format YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (event) => {
    setLoading(true);

    event.preventDefault();

    const formData = new FormData();
    formData.append('product_name', product_name);
    formData.append('product_mrp', product_mrp);
    formData.append('quantity', quantity_available);
    formData.append('offer', offer);
    formData.append('delivary_charges', delivary_charges);
    formData.append('product_type', product_type);
    formData.append('discription', discription);

    formData.append('selected', '0'); // You might want to change 'selected' to 'selected'
    formData.append('date',getCurrentDate())

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('product_images', selectedFiles[i]);
    }

    const validation = validate_Home_Form(
      product_name,
      product_mrp,
      quantity_available,
      offer,
      delivary_charges,
      product_type,
      discription
    );

    if (validation) {
      formData.append('email', user?.email);

      try {
        await axios.post(`${base_url}/api/addproducts`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setTimeout(() => {
          setLoading(false); 
        }, 500);
        toast.success('Product Submitted to Admin');
        navigate('/product');
      } catch (error) {
        console.error('Error submitting product:', error);
        toast.error('Error submitting product');
      }finally {
        setLoading(false); // Set loading state to false after the request is complete
      }
    } else {
      console.log('No proper Validation');
    }
  };

  const validate_Home_Form = (product_name, product_mrp, quantity_available, offer, delivary_charges, product_type, discription) => {
    let x1 = product_name.match(/^[A-Za-z0-9_\s]+$/);
    let x2 = quantity_available.match(/^[1-9][0-9]*$/);
    let x4 = product_mrp.match(/^[1-9][0-9]*$/);
    let x5 = offer.match(/^[1-9][0-9]{0,1}$/);
    let x6 = delivary_charges.match(/^[1-9][0-9]*$/);

    if (!(x1 != null && product_name.length >= 3 && product_name.length <= 30)) {
      alert('Product Name must have at least 3 characters and less than 30 and consists of only alphadigit');
      return false;
    }

    // if (!(x2 != null && quantity_available >= 1)) {
    //   alert('Quantity must be at least 1 and a positive number');
    //   return false;
    // }

    if (!(x4 != null)) {
      alert('Product MRP must be a positive number');
      return false;
    }

    if (!(x5 != null && offer > 0 && offer < 100)) {
      alert('Offer must be a positive integer and in between 1 and 100');
      return false;
    }

    if (!(x6 != null)) {
      alert('Delivery Charges must be a positive number and greater than 1');
      return false;
    }
    if (selectedFiles.length !== 3) {
      alert('Please select exactly 3 images.');
      return false;
    }

    return true;
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'blue', fontSize: '40px', marginTop: '8rem' }}> Upload Product Details Through the Form</h1>
      <br /><br />

      <div className="SA_form">
        <form onSubmit={handleSubmit}>
          <div className="pname"> Product Name </div>
          <input
            style={{ width: '40%' }}
            placeholder="Enter the Product Name"
            type="text"
            id="Product_Name"
            name="product_name"
            title="Enter the name of the Product not more than 30 characters"
            value={product_name}
            onChange={(e) => setProduct_name(e.target.value)}
            required
          />

          <div className="pimage"> Product Images (3 Images)</div>
          <input
            style={{ width: '40%'  }}
            type="file"
            name="product_images"
            id="Product_Image"
            multiple
            onChange={handleFileChange}
            title="Upload images of the Product"
            required
          />

          <div className="pmrp"> Product MRP </div>
          <input
            type="number"
            name="product_mrp"
            id="MRP"
            placeholder="Enter the MRP"
            title="Enter the MRP of the Product"
            value={product_mrp}
            onChange={(e) => setProduct_mrp(e.target.value)}
            required
          />

          <input style={{ display: 'none' }} type="text" name="selcted" id="sel" value="0"  />

          <div className="pquantity"> Quantity </div>
          <input
            type="text"
            id="Quantity"
            name="quantity_available"
            placeholder="Enter Quantity"
            title="Enter the Quantity available"
            value={quantity_available}
            onChange={(e) => setQuantity_available(e.target.value)}
            required
          />

          <div className="poffer"> Offer Percentage (If any) </div>
          <input
            type="number"
            id="Offer"
            name="offer"
            placeholder="Enter Offer %"
            title="Enter Offer Percentage(Only Number) if applicable else leave it as null"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
          />

          <div className="pdelivery_charges"> Delivery Charges </div>
          <input
            type="number"
            id="Delivery_Charges"
            name="delivary_charges"
            placeholder="Enter the Delivery Charges"
            title="Enter the Delivery Charges of the Product"
            value={delivary_charges}
            onChange={(e) => setDelivary_charges(e.target.value)}
            required
          />

          <div className="pproduct_type"> Select the Product Type </div>
          <select
            name="product_type"
            id="Product_Type"
            title="Select the Type of the Product"
            value={product_type}
            onChange={(e) => setProduct_type(e.target.value)}
          >
            <option value="" disabled selected hidden>
              Choose an option
            </option>
            {user?.role === 'Sales Agent' ? (
              <>
                <option value="Organic Fertilizer"> Organic Fertilizer </option>
                <option value="Seeds"> Seeds </option>
                <option value="HTP Machines"> HTP Machines </option>
              </>
            ) : user?.role === 'Farmer' ? (
              <>
                <option value="Vegetable"> Vegetable</option>
                <option value="Fruit"> Fruit </option>
                <option value="Dairy/Meat"> Dairy/Meat </option>
              </>
            ) : null}
          </select>


          <div className="pdescription"> Write down the Description of the Product </div>
          <textarea
            name="discription"
            id="Item_Description"
            rows="10"
            cols="120"
            value={discription}
            onChange={(e) => setDiscription(e.target.value)}
            style={{ resize: 'none' }}
            placeholder="Enter the Description of the Product here!"
            title="Enter the Description of the Product not more than 20-30 words"
            // maxLength="300"
            required
          ></textarea>
          <br /><br /><br />

          <button style={{ marginTop: '2rem' }} id="submit_button" type="submit" title="Submit the Form">
            Submit
          </button>
          <button style={{ marginTop: '2rem' }} id="reset_button" type="Reset" title="Reset Your Response">
            Reset
          </button>
        </form>
      </div>
      <br /><br /><br /><br />
      <ToastContainer />
      <div className='loader_in'>{loading && <Loader />}</div>

    </div>
  );
};

export default Form;
