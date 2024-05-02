import React from 'react'
import "./About.css"
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import Apples from "../AboutUs/apples.webp"
import Story from "../AboutUs/story.webp"

export default function About() {
    return (
        <>
            <Header />
            <br />
            <div className="statement">
                <div className="lefty1">
                    <h2 style={{color:'green'}} className='misson'>Our Mission</h2>
                    <p className='para'>Agro and Organic Farm Delicacy is dedicated to fostering a sustainable, transparent, and thriving ecosystem for the buying and selling of farm produce and agricultural equipment. Our mission is to empower farmers,small-scale producers, and rural communities worldwide by providing them with a fair and efficient platform to showcase their products, connect with buyers, and access the tools they need to succeed.</p>
                </div>
                <div className="righty1">
                    <img class="profimg" src={Apples} style={{ height: "20em", width: "20em", borderRadius: "20px", marginRight:'8rem' }}></img>
                    
                    </div>
                </div>



            <div className="story">
                <div className="lefty">
                    <img className="profimg2" src={Story} style={{ height: "20em", width: "22em", borderRadius: "20px", marginLeft:'10rem'  }}></img>
                </div>
                <div className="righty">
                    <h2 style={{color:'green'}}>Our Story</h2>
               <p className='para2'>    In the heart of the rural countryside, nestled amongst rolling green hills and rich fertile soil, a vision was born. It was a vision to connect farmers and producers with consumers in a way that was sustainable, transparent, and mutually beneficial. And so, Agro and Organic Farm Delicacy came into being.

                    Our journey started with a small group of passionate individuals who shared a deep love for agriculture and a belief in the power of technology to transform the way we grow, buy, and sell food. We recognized the challenges faced by small-scale farmers in reaching consumers directly, the lack of transparency in the supply chain, and the need for a platform that could bridge these gaps.
                    </p>   
                </div>

            </div>

            <div className="evolution">
                With this vision in mind, we set out to create <b>Agro and Organic Farm Delicacy</b>—a platform where farmers and producers could showcase their products, connect with buyers, and access the tools and resources they need to succeed. Our team worked tirelessly to build a user-friendly interface, implement robust security measures, and establish partnerships with trusted suppliers and buyers.

                Today, Agro and Organic Farm Delicacy stands as a testament to the power of collaboration and innovation. We have empowered countless farmers and producers to reach a global audience, provided consumers with access to fresh, high-quality products, and helped build a more sustainable and resilient food system.
            </div>
            <br /><br /><br />
            <h1 className='profiletitl'>Our Statistics</h1>
            <div className="aha">
                <p><h1>200</h1><br /> <h3>Farmers</h3></p>
                <p><h1>450K</h1><br /><h3> Products</h3></p>
                <p><h1>145K </h1><br /><h3>Customers</h3></p>
            </div>
            <br /><br />
            <h1 className='profiletitl'>Who Are We?</h1>
            <div className="whoweare">
            <div className='profilecard'>
                    <h5>Sai Kumar</h5>
                    <h6>S20210010077</h6>
                    <h4>CSE, IIITS</h4>
                </div> <div className='profilecard'>
                    <h5>Ashraf Ali</h5>
                    <h6>S20210010111</h6>
                    <h4>CSE, IIITS</h4>
                </div>
                <div className='profilecard'>
                    <h5>K.Y.Vaishnavi</h5>
                    <h6>S20210010109</h6>
                    <h4>CSE, IIITS</h4>

                </div> <div className='profilecard'>
                    <h5>Sai Hari</h5>
                    <h6>S20210010037</h6>
                    <h4>CSE, IIITS</h4>
                </div> <div className='profilecard'>
                    <h5>Aishwarya</h5>
                    <h6>S20210010070</h6>
                    <h4>CSE, IIITS</h4>
                </div>

            </div>
           

            <Footer />
        </>
    )
}
