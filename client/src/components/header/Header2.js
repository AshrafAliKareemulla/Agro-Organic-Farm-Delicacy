import React, { useEffect } from 'react';
import './Header.css';
import Logo from "./register.png";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, RESET_AUTH, logout } from '../../redux/features/auth/authSlice';
import { ShowOnLogout, ShowOnLogin } from '../hiddenLinks/hiddenLink';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/login");
  };

  return (
    <header>
      <div className='header'>
      
      <Link to='/'><img src={Logo} style={{ height: "90px" }} /></Link>
        <div className="navlinks">
          {/* <!-- !Home -->  */}
          <div className="Home_Button">
            <Link className="linki" to="/" >Home</Link>
          </div>
          <div className="Home_Button">
            <Link className="linki" to="/product">Products</Link>
          </div>
          <div className="Home_Button">
            <Link className="linki" to='/cart'>Cart</Link>
          </div>
          <div className="Home_Button">
            <Link className="linki" to="/about">About Us</Link>
          </div>
          <div className="Home_Button">
            <Link className="linki" to="/QAs">FAQs</Link>
          </div>
          <div className="Home_Button">
            {/* Change based on user role */}
            {user?.role === 'Sales Agent' ? (
              <Link className="linki" to="/sales">SaleProduct</Link>
            ) : user?.role === 'Farmer' ? (
              <Link className="linki" to='/sales'>Farmer Advertise</Link>
            ) : null}
          </div>
       
        </div>
        <div className="SVGICON">
          <ShowOnLogout>
            <Link to="/register">
              <svg width="100px" height="100px" viewBox="-13.68 -13.68 51.36 51.36" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <circle opacity="0.5" cx="12" cy="9" r="3" stroke="#282a2f" stroke-width="0.984"></circle>
                  <circle cx="12" cy="12" r="10" stroke="#282a2f" stroke-width="0.984"></circle>
                  <path opacity="0.5" d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#282a2f" stroke-width="0.984" stroke-linecap="round"></path>
                </g>
              </svg>
            </Link>
          </ShowOnLogout>
          <div>
          <Link to={"/userprofile"}>
            <h1 style={{ marginRight: '50px' }}>
            {user && (
  <div
    style={{
      display: 'inline-block',
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      backgroundColor: 'orange',
      textAlign: 'center',
      lineHeight: '50px',
      fontSize: '24px',
      fontSize: '2rem',
      textTransform: 'uppercase'
    }}
  >
    {user?.images?.length > 0 ? (
      <img
        src={`data:image/png;base64,${user.images[0].data}`}
        alt="profile"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          marginBottom: '20px',
          marginRight: '10px'
        }}
      />
    ) : (
      <div>{user?.name.charAt(0)}</div>
    )}
  </div>
)}


            </h1></Link>
          </div>
          {/* <div style={{marginRight:'3rem', width:'115px', padding:'2px'}} className="signup_dropdown">
            <ShowOnLogout>
              <Link href="/register">SIGNUP</Link>
            </ShowOnLogout>
            <ShowOnLogin>
            <Link   to={"/"} onClick={logoutUser}>LOGOUT</Link>
            </ShowOnLogin>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
