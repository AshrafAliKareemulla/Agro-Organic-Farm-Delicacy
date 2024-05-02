import React, { useRef, useEffect, useState } from 'react';
import './assets/CSS/auth.scss';
import { Link, useNavigate } from 'react-router-dom';
import LoginImg from './assets/images/green.avif';
import { toast } from 'react-toastify';
import { validateEmail } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { register, RESET_AUTH } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import LocationApp from './LocationApp';
import { useParams } from 'react-router-dom';

export function Register() {
    const { locationString } = useParams();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phonenumberRef = useRef();
  const roleRef = useRef();
  const addressRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, isSuccess } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const registerUser = async (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const phonenumber = phonenumberRef.current.value;
    const role = roleRef.current.value;
    const address = addressRef.current.value;

    if (!email || !password) {
      return toast.error('All fields are required');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (phonenumber.length < 10) {
      return toast.error('Please provide a valid phone number');
    }
    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    const userData = {
      name,
      email,
      password,
      phonenumber,
      role,
      address,
    };
    await dispatch(register(userData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate('/product');
    }
    dispatch(RESET_AUTH());
  }, [isSuccess, isLoggedIn, dispatch, navigate]);

  return (
    <>
      <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
        <Header />
      </div>
      {isLoading && <Loader />}
      <section className="signInContainer">
        <div className="form">
          <h2>SIGNUP</h2>
          {/* <p>Location String: {locationString}</p> */}
          <form onSubmit={registerUser} id="form1">
            <input ref={nameRef} type="text" placeholder="Name" id="name" />
            <br />
            <input ref={phonenumberRef} type="text" placeholder="Phone Number" id="phone" />
            <br />
            <label>Role:</label>
            <select ref={roleRef} id="role">
              <option value="Customer">Customer</option>
              <option value="Farmer">Farmer</option>
              <option value="Sales Agent">Sales Agent</option>
            </select>
            <br />
            <input ref={emailRef} type="email" placeholder="Email" id="email" />
            <br />
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              autoComplete="false"
              placeholder="Password"
              id="password"
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? '😐' : '😑'}
            </span>
            <br/>
            <br/>

     


            <input ref={addressRef} type="text" placeholder="Address" id="address" value={locationString} readOnly />
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="img">
          <img src={LoginImg} alt="Login" />
          <div className="overlayContainer">
            <div className="overlay">
              <div className="overlayPanel">
                <h1>Registered?</h1>
                <p>Let's get you logged in! </p>
                <button className="ghost" id="signIn">
                  <span>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                      LOGIN
                    </Link>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LocationApp setLocationString={locationString} />
      <Footer />
    </>
  );
}
