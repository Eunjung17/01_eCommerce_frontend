/* eslint-disable react/prop-types */
import React from 'react';
import './AboutUs.css';

export default function AboutUs({token, setToken, userRole, setUserRole}) {
    return(
        <>


        <div className="row">
            <div className="middle2column">
                <div className="card2">
                <div className="about-section">
  <h1>About Us Page</h1>
  <p>Welcome to our store! We offer a wide range of high-quality products to meet your needs. Our goal is to provide exceptional customer service and a seamless shopping experience.</p>
    <p>We are dedicated to bringing you the best deals and a variety of options to choose from. Thank you for choosing us!</p>
</div>

<h2 style={{textAlign:'center' }}>Our Team</h2>
<div className="row">
  <div className="column">
    <div className="card">
      {/* <img src="/w3images/team1.jpg" alt="Jane" style={{width:'100%'}}/> */}
      <div className="container">
        <h2>Jane Doe</h2>
        <p className="title">CEO & Founder</p>
        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
        <p>jane@example.com</p>
        <p><button className="button">Contact</button></p>
      </div>
    </div>
  </div>

  <div className="column">
    <div className="card">
      {/* <img src="/w3images/team2.jpg" alt="Mike" style={{width:'100%'}}/> */}
      <div className="container">
        <h2>Mike Ross</h2>
        <p className="title">Art Director</p>
        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
        <p>mike@example.com</p>
        <p><button className="button">Contact</button></p>
      </div>
    </div>
  </div>

  <div className="column">
    <div className="card">
      {/* <img src="/w3images/team3.jpg" alt="John" style={{width:'100%'}}/> */}
      <div className="container">
        <h2>John Doe</h2>
        <p className="title">Designer</p>
        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
        <p>john@example.com</p>
        <p><button className="button">Contact</button></p>
      </div>
    </div>
  </div>
</div>
                </div>
            </div>
        </div>
           
        </>
    );
}