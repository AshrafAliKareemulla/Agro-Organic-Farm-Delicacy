import React, {  useEffect } from 'react';
import './userprofile.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';
import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
import { RESET_AUTH, logout } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Logo from "./register.png";



import Header2 from '../components/header/Header2';
// import Footer from '../components/footer/Footer';



const UserProfile = () => {
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
    navigate("/Register");
  };


  const isCustomer = user && user.role === 'Customer';


  return (
    <>
    {/* <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
      <Header2 />
    </div> */}
    <div className="container_web">
      <div className="sidebar_web">
      <ul>
            <Link to='/'><img src={Logo} style={{ height: "140px" , marginBottom:'40px',marginTop:'-40px ' }} /></Link>
            <li> <Link to={'/userprofile'}>Profile</Link></li>
            <li><Link to={"/userprofilecart"}>Ordered Data</Link></li>
            {!isCustomer && <li><Link to={"/userprofileproduct"}>Uploaded Data</Link></li>}
            <li> <Link to={"/userprofile/profile"}>Update Profile</Link></li>
      
      </ul>
      <div className='verify-btn3'>
          <button className="verify-btn2" onClick={logoutUser}>
        Logout
      </button> </div> 
      </div>
      <div className="body_user">
        <div className="user-card_web">
        <img
        className="user-avatar_web"
        src={user?.images?.length > 0 ? `data:image/png;base64,${user?.images[0].data}` : user?.photo}
        alt="Photo"
      />

          <div className="user-details_web">
            <p className="user-info-item">
              <span className="user-info-label">NAME</span>
              <span className="user-info-data">: {user?.name}</span>
            </p>
            <p className="user-info-item">
              <span className="user-info-label">EMAIL</span>
              <span className="user-info-data">: {user?.email}</span>
            </p>
            <p className="user-info-item">
              <span className="user-info-label">PHOMENUMBER</span>
              <span style={{ marginLeft:'87px'}} className="user-info-data">: {user?.phonenumber}</span>
            </p>
            <p className="user-info-item">
              <span className="user-info-label">ROLE</span>
              <span style={{ marginLeft:'200px'}} className="user-info-data">: {user?.role}</span>
            </p>
            <p className="user-info-item">
              <span className="user-info-label">ADDRESS</span>
              <span style={{ marginLeft:'160px',fontSize:'13px' }} className="user-info-data">: {user?.address}</span>
            </p>

            
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default UserProfile;
