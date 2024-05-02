// Otp.js

import React, { useEffect, useState } from 'react';
import './otp_css.css';
import axios from "axios";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, RESET_AUTH, logout } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { base_url } from '../utils/config';

const Otp = () => {
  const [correctOtp, setCorrectOtp] = useState('');  // Assuming you have a function to generate a random OTP
  const [remainingTime, setRemainingTime] = useState(45);
  const [enteredOtp, setEnteredOtp] = useState('');
  
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Make sure the URL is correct
    axios.post(`${base_url}/api/addotp`, { email: user?.email })
      .then(response => {
        const receivedMessage = response.data.message.otp;
        setCorrectOtp(receivedMessage);
      })
      .catch(error => {
        console.error('Error fetching OTP message:', error);
      });
  }, []);

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEnteredOtp(value);
  };
  const [userId, setuserId] = useState(user?._id);
  console.log(userId)

  const handleVerify = async (userId) => {
    // Assuming you have a way to verify the OTP against the correct value
    const isOtpCorrect = verifyOtp(enteredOtp, correctOtp);

    if (isOtpCorrect) {
      navigate('/product');
      toast.success("Register Successfully");
    } else {
      // Handle successful OTP verification here
      
      await axios.delete(`${base_url}/api/removeuser/${userId}`);
      logoutUser(); // Logout if OTP is incorrect
      toast.error("Incorrect Otp");
    }
  };

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    const navigateTimeoutId = setTimeout(() => {
      navigate('/');
    }, 45000);

    return () => {
      clearInterval(timeoutId);
      clearTimeout(navigateTimeoutId);
    };
  }, [navigate]);

  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/Register");
  };

  const verifyOtp = (enteredOtp, correctOtp) => {
    return enteredOtp === correctOtp;
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      {correctOtp && <p>Received OTP Message: {correctOtp}</p>}
      <div className="otp-inputs">
        <input
          type="text"
          value={enteredOtp}
          onChange={handleChange}
          className="otp-input"
        />
      </div>
      <button className="verify-btn" onClick={handleVerify}>
        Verify OTP
      </button>
      <p>Remaining Time: {remainingTime} seconds</p>
    </div>
  );
};

export default Otp;
