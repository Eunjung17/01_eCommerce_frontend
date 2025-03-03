import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import './UserDetail.css';

export default function UserDetail({token, setToken}) {
    const location = useLocation();
    const { response } = location.state;
    console.log(response.response);
    console.log(response.status);

    if(!response.status) { console.log("ss");} //select from quary

    return(
        <>
            <div className="registration-form-whole">
                <div className="registration-form">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                                {response.response.email}                       
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" value={response.response.email} required readonly/>
                    </div>
                </div>

            </div>
        </>
        );
}