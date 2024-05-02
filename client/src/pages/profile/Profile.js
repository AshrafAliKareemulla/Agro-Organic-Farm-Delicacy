import React, { useEffect, useState } from 'react';
import "./Profile.css";
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/card/Card';
import { getUser, updateUser } from '../../redux/features/auth/authSlice';
import Header from '../../components/header/Header';
// import Footer from "../../components/footer/Footer";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { RESET_AUTH, logout } from '../../redux/features/auth/authSlice';
import Logo from "./register.png";
import { base_url } from '../../utils/config';




const Profile = () => {
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

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


  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
    role: user?.role || "",
    photo: user?.photo || "",
    address: user?.address || "",
    images: user?.images || []  // Add this line to set the images array
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_id', user?._id);
    formData.append('name', profile.name);
    formData.append('phonenumber', profile.phonenumber);
    formData.append('address', profile.address);


    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    try {
      console.log(formData);
      await axios.post(`${base_url}/api/updateprofile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile Update Successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  const isCustomer = user && user.role === 'Customer';


  return (
    <>
      {/* <div style={{ position: 'fixed', width: '100%', zIndex: '9999', top: '0' }}>
        <Header />
      </div> */}
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

      <section className='cp'>
        <div className='container new'>
          <div className="--flex-start profile">
            <Card cardClass={"card_1"}>
              {!isLoading && (
                <>
                  <div className='profile-photo'>
                    <div>
                      {/* Check if images array exists, display the first image; otherwise, display the photo */}
                      <img src={profile.images.length > 0 ? `data:image/png;base64,${profile.images[0].data}` : profile.photo} alt="profile" />
                      <h3>Role: {profile.role}</h3>
                    </div>
                  </div>
                  <form className='form_s' onSubmit={saveProfile}>
                    <p>
                      <label className='labesl_sai'>Change Photo</label><br />
                      <input className='input_sai' type="file" name="images" onChange={handleFileChange} />
                    </p>
                    <p>
                      <label className='labesl_sai'>Name:</label><br />
                      <input className='input_sai' type="text" name="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
                    </p>
                    <p>
                      <label className='labesl_sai'>Email:</label><br />
                      <input className='input_sai' type="email" name="email" value={profile.email} disabled />
                    </p>
                    <p>
                      <label className='labesl_sai'>Phone Number:</label><br />
                      <input className='input_sai' type="text" name="phone" value={profile.phonenumber} onChange={(e) => setProfile({ ...profile, phonenumber: e.target.value })} required />
                    </p>
                    <p>
                      <label>Address:</label><br />
                      <input className='input_sai' type="text" name="address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} required />
                    </p>
                 
                    <button className='--btn --btn-primary --btn-block'>
                      Update Profile
                    </button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </section>
      {/* <div style={{ zIndex: '9999'}} className='Footer_user'>
        &copy; {} All Rights Reserved
      </div> */}
    </>
  );
};

export default Profile;
