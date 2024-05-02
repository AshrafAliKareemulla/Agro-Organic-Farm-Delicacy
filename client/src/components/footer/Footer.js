import React from 'react'
import styles from './Footer.module.css'
import {Link} from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer=()=> {
    const date=new Date();
    const year=date.getFullYear();
  return (
    <>
   
<footer className={styles.footer2} >
    <div className={styles.container}>
        <div className={styles.row}>
            <div className={styles.footerCol}>
                <h4>Discover</h4>
                <ul>
                    
                    <li><Link to="/about">About</Link></li>
                    <li><a href="/">Accessibility</a></li>
                    <li><a href="/">Contracting</a></li>
                    <li><a href="/">Privacy & Security Notice</a></li>
                </ul>
            </div>
            <div className={styles.footerCol}>
                <h4>References</h4>
                <ul>
                    
                    <li><a href="/">NASA Power Data</a></li>
                    <li><a href="/">World Clim</a></li>
                    <li><a href="/">Bio-Diversity Informatics</a></li>
                    
                   
                </ul>
            </div>
            <div className={styles.footerCol}>
                <h4>Ask Us</h4>
                <ul>
                    <li><Link to="/contactus">Contact us</Link></li>
                    <li><a href="/">AOFD Disclaimers</a></li>
                    <li><a href="/">Hotlines</a></li>
                    <li><Link to="/QAs">FAQs</Link></li>
                </ul>
            </div>
            <div className={styles.footerCol}>
                <h4 style={{marginLeft:'2rem'}}>follow us</h4>
                <div style={{ display: "flex", maxWidth: "200px", margin: "0 auto" }}>
                <Link to="/" style={{ color: "#333", fontSize: "24px", margin: "0 4px" }}><FaFacebookF /></Link>
                <Link to="/" style={{ color: "#333", fontSize: "24px", margin: "0 4px" }}><FaTwitter /></Link>
                <Link to="/" style={{ color: "#333", fontSize: "24px", margin: "0 4px" }}><FaInstagram /></Link>
                <Link to="/" style={{ color: "#333", fontSize: "24px", margin: "0 4px" }}><FaLinkedinIn /></Link>
    </div>
            </div>
        </div>
    </div>
</footer>
<div className={styles.footer}>&copy; {year} All Rights Reserved </div>

</>
  )

}

export default Footer;