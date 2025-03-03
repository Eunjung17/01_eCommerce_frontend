/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect  } from "react";
import { useGetSingleUserQuery, useUpdateUserProfileMutation } from '../../redux/slices/userSlice'

import './UserProfile.css';

export default function UserProfile({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useGetSingleUserQuery(token);
    const [ updateUserProfileAPI, {isLoading2, error2}] = useUpdateUserProfileMutation();

    const [ alert, setAlert ] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [ addressFlag, setAddressFlag ] = useState(null);
    const [ phoneFlag, setPhoneFlag ] = useState(null);

    const handleClose = () => {

        setFadeOut(true);
        setTimeout(() => {
            setAlert("");
            setFadeOut(false);
        }, 600);
    }


    const openModal = () => setShowModal(true);

    const closeModal = () => setShowModal(false);

    const returnHome = () => {

        navigate("/");
    }

    const changeAddress  = () => {
        setAddressFlag("change");
    }
    
    const changePhone  = () => {
        setPhoneFlag("change");
    }

    const handleChange = (e) => {
        setProfileData({...profileData, [e.target.name]: e.target.value});
        console.log(profileData);
    }

    const saveChangeProfile  = async () => { 
        setAlert(null);

        const response = await updateUserProfileAPI({token, profileData}).unwrap(); 
        setShowModal(true);
    }

    const [ profileData, setProfileData] = useState({
        address: '',
        phone: '',
    });

    const cancel  = () => {
        navigate("/");
    }

    if (isLoading || isLoading2) return <div>Loading categories...</div>;
    if (error || error2){
        if(error?.data){
            return <div className="card">{error?.data?.message}<button className="btn btn-primary" type="submit" style={{margin: '5px' ,width: '20%'}}onClick={()=>returnHome()}>return to home</button></div>;
        }else{
            return <div className="card">Error loading Data<button className="btn btn-primary" type="submit" style={{margin: '5px',width: '20%'}}onClick={()=>returnHome()}>return to home</button></div>;
        }
        
    }

    return(
        <>



<div>

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message</h5>
                {/* <button type="button" className="close" onClick={()=>closeModal()} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button> */}
              </div>
              <div className="modal-body">
                <p>It has been successfully updated.</p>
              </div>
              <div className="modal-footer">
                <Link to="/" style={{float:'right'}}>
                    <button type="button" className="btn btn-primary">Go to Home</button> 
                </Link>
                <button type="button" className="btn btn-secondary" onClick={()=>closeModal()}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


        <div className="row">
            <div className="middle2column">
                <div className="card">

                {alert &&
                    <div id="notification" className={`alert warning ${fadeOut ? 'fade-out' : ''}`} onClick={handleClose}>
                        <span className="closebtn">&times;</span>  
                        <strong>Warning!</strong> {alert}
                    </div>
                }

                <h5 className="card-title"><i><u>User Profile</u></i></h5>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col"><h5>Info.</h5></th>
                                <th scope="col"><h5>Detail</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                            {!isLoading && user ? 
                                <React.Fragment key={user.id}> 
                                <tr> 
                                <th scope="row">Email</th>
                                <th scope="row">{user.email}</th>
                                </tr>
                                <tr> 
                                <th scope="row">First Name</th>
                                <th scope="row">{user.firstName}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Last Name</th>
                                <th scope="row">{user.lastName}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Address</th>
                                <th scope="row">
                                    
                                    {!addressFlag ?
                                            <>
                                                {user.address}<button type="button" className="btn btn-secondary" style={{marginLeft: '10px'}} onClick={changeAddress} >Change</button>

                                            </> 
                                            :
                                                <input type="newAddress" className="form-control" id="address" name="address" value={profileData.address} placeholder="Enter new Address" onChange={handleChange}   required/>
                                    }
                                </th>
                                </tr>
                                <tr> 
                                <th scope="row">Phone</th>
                                <th scope="row">
                                    {!phoneFlag ?
                                            <>
                                                {user.phone}<button type="button" className="btn btn-secondary" style={{marginLeft: '10px'}} onClick={changePhone} >Change</button>

                                            </> 
                                            :
                                                <input type="newAddress" className="form-control" id="phone" name="phone" value={profileData.phone} placeholder="Enter new phone number" onChange={handleChange}   required/>
                                    }
                                </th>
                                </tr>
                                <tr> 
                                <th scope="row">Admin confirmed</th>
                                <th scope="row">{user && user.confirmAdmin === false ? 'No' : 'Yes'}</th>
                                </tr>
                                {user && user.taxId === "2" &&
                                <tr> 
                                <th scope="row">taxId</th>
                                <th scope="row">{user && user.taxId === "" ? 'None' : user.taxId}</th>
                                </tr>
                                }

                                </React.Fragment>
                            : (<tr><td colSpan="7">There is no product.</td></tr>)
                        }

                                <tr> 
                                    <td colSpan="2">
                                    <button type="button" className="btn btn-primary btn-lg" style={{width:'200px', margin:'20px'}} onClick={saveChangeProfile}>Save</button>
                                    <button type="button" className="btn btn-primary btn-lg" style={{width:'200px', margin:'20px'}} onClick={cancel}>Cancel</button>      
                                    </td>
                                </tr>
                            </tbody>
                        </table> 
                </div>
            </div>
        </div>
           
        </>
    );
}