/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetUserRoleQuery, useGetAllUserQuery, useAccessChangeUserMutation } from '../../redux/slices/userSlice'
import './UserManage.css';

export default function UserManage({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();
    const { data: userRoles, isLoading1, error1 } = useGetUserRoleQuery(token);
    const { data: allUsers, isLoading2, error2 } = useGetAllUserQuery(token);
    const [accessChangeUser, {isLoading3, error3}] = useAccessChangeUserMutation();

    const [activeIndex, setActiveIndex] = useState(null); 
    const[userRoleId, setUserRoleId] = useState(null);
    const[userDetailId, setUserDetailId] = useState(null);

    const users = (allUsers || []).filter((p)=>{return p.userRoleId === parseInt(userRoleId)});

    const userDetail = (allUsers || []).filter((p)=>{return p.id === userDetailId});

    // Toggle the panel based on the index
    const togglePanel = (index) => {
        setUserRoleId(index);
        setActiveIndex(activeIndex === index ? null : index); // Close if already open, open if closed
    };

    const eventAcceptUser = async (userId) => {
 
        if(userId){
            //const {data: response} = await confirmUser({token, userId}).unwrap();
            const response = await accessChangeUser({token, userId}).unwrap();
            console.log(response);
        }
    };

    const eventUserDetail = (userId) => {
        setUserDetailId(userId);
    };


    if (isLoading1 || isLoading2 || isLoading3) return <div>Loading categories...</div>;
    if (error1 || error2 || error3) return <div>Error loading categories</div>;

    return(
        <>
            <div className="row">
                <div className="leftcolumn">
                    <div className="accordion0"><h3>User Role</h3></div>
                    {userRoles && userRoles.map(userRole => (            
                    <div key={userRole.id} >
                        <button className="accordion" onClick={()=>togglePanel(`${userRole.id}`)}>
                            {userRole.name}
                        </button>
                    </div>
                    ))}
                </div>
    
                <div className="middlecolumn">
                    <div className="card">
                    {/* <div style={{display:'flex',float:'right',margin:'20px'}}>
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" style={{ marginRight: '10px' }} />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </div> */}
                    <div><h3>User List</h3></div>
                    {!activeIndex && 
                        <p>Click one of user roles to see user details</p>
                    }

                   
                    <table className="table table-hover" style={{display:activeIndex === `${userRoleId}` ? 'block': 'none'}}>
                            <thead>
                                <tr>
                                    <th scope="col"><h5>Email</h5></th>
                                    <th scope="col"><h5>Access Status</h5></th>
                                    <th scope="col"><h5>Change</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                            {users && users.map(user => (   
                                <tr key={user.id}>
                                    <td className="user-email" onClick={()=>eventUserDetail(`${user.id}`)}>{user.email}</td>
                                    <td>
                                        {user.confirmAdmin === true ? 
                                        
                                        <h5>Access</h5>
                                        :
                                        <h5>Denied</h5>
                                        }
                                    </td>
                                    <td>
                                        {user.confirmAdmin === true ? 
                                        
                                        <button className="btn btn-outline-secondary" type="submit" onClick={()=>eventAcceptUser(`${user.id}`)}>Accept to Deny</button>
                                        :
                                        <button className="btn btn-outline-secondary" type="submit" onClick={()=>eventAcceptUser(`${user.id}`)}>Deny to Accept</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                    </table>         
                    
                    </div>
                </div> 
                <div className="rightcolumn">


                    <div className="card">

                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col"><h5>Info.</h5></th>
                                <th scope="col"><h5>Detail</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                            {userDetail && userDetail.map(user => (  
                                <React.Fragment key={user.id}> 
                                <tr> 
                                <th scope="row">Email</th>
                                <th scope="row">{user.email}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Name</th>
                                <th scope="row">{user.firstName}, {user.lastName}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Address</th>
                                <th scope="row">{user.address}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Phone</th>
                                <th scope="row">{user.phone}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Access Status</th>
                                <th scope="row">{user && user.confirmAdmin === false ? 'Denied' : 'Accept'}</th>
                                </tr>
                                <tr> 
                                <th scope="row">taxId</th>
                                <th scope="row">{user && user.taxId === "" ? 'None' : user.taxId}</th>
                                </tr>
                                <tr> 
                                <th scope="row">isDeleted</th>
                                <th scope="row">{user && user.isDeleted === false ? 'No' : 'Yes'}</th>
                                </tr>
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table> 




                    </div>
                </div>
            </div>
        </>
        );
}