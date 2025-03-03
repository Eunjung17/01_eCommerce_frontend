/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect  } from "react";
import { useSingleProductMutation } from '../../redux/slices/productSlice'
import { useAddCartMutation } from '../../redux/slices/cartSlice'

import './SingleProduct.css';

export default function SingleProduct({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId = null } = location.state || {};

    const [ addCartApi, {isLoading2, error2}] = useAddCartMutation();
    const [ singleProductAPI, {isLoading, error}] = useSingleProductMutation();
    const [ singleProduct, setSingleProduct ] = useState(null);
    const [ alert, setAlert ] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        
        console.log("productId!!", productId);
        if(productId){
            const fetchProductDetails = async () => {

                try {

                    const response = await singleProductAPI({token, productId}).unwrap(); 

                    setSingleProduct(response);
                    
                } catch (error) {
                    setAlert("something wrong.");
                    console.log(error);
                }
        };

        fetchProductDetails();
        }

    }, [productId, token, singleProductAPI]);

    const handleClose = () => {

        setFadeOut(true);
        setTimeout(() => {
            setAlert("");
            setFadeOut(false);
        }, 600);
    }


    const cart = async (productId, quantity) => {

        setAlert(null);


        if(!token){
            return openModal();
        }
        else if(userRole === '2') return setAlert("Business user can't order products."); 
        else if(userRole === '3') return setAlert("Admin user can't order products."); 
        else{

            const response = await addCartApi({token, productId, quantity}).unwrap(); 

            navigate("/UserCart");
        }
}

    const order  = async(productId, quantity) => {

        setAlert(null);


        if(!token){
            return openModal();
        }
        else if(userRole === '2') return setAlert("Business user can't order products."); 
        else if(userRole === '3') return setAlert("Admin user can't order products."); 
        else{

            console.log("productId category:" ,productId);
            navigate("/SingleOrder", {state: {productId:productId}});
        }
    }

    const openModal = () => setShowModal(true);

    const closeModal = () => setShowModal(false);

    const returnHome = () => {

        navigate("/");
    }


    if (isLoading || isLoading2) return <div>Loading categories...</div>;
    if (error || error2){
        if(error?.data){
            return <div className="card">{error?.data?.message}<button className="btn btn-primary" type="submit" style={{margin: '5px' ,width: '20%'}}onClick={()=>returnHome()}>return to home</button></div>;
        }else{
            return <div className="card">Error loading categories<button className="btn btn-primary" type="submit" style={{margin: '5px',width: '20%'}}onClick={()=>returnHome()}>return to home</button></div>;
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
                <p>You should log in to use this menu.</p>
              </div>
              <div className="modal-footer">
                <Link to="/SignIn" style={{float:'right'}}>
                    <button type="button" className="btn btn-primary">Sign in</button> 
                </Link>
                <Link to="/Registration" style={{float:'right'}}>
                    <button type="button" className="btn btn-primary">Register</button>
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






                    {/* <div style={{display:'flex',float:'right',margin:'20px'}}>
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" style={{ marginRight: '10px' }} />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </div> */}
<table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col"><h5>Info.</h5></th>
                                <th scope="col"><h5>Detail</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                            {!isLoading && singleProduct ? 
                                <React.Fragment key={singleProduct.id}> 
                                <tr> 
                                <th scope="row">Main Category</th>
                                <th scope="row">{singleProduct?.categoryDetail?.category?.name}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Sub Category</th>
                                <th scope="row">{singleProduct?.categoryDetail?.name}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Product Name</th>
                                <th scope="row">{singleProduct?.name}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Image</th>
                                <th scope="row"><img className = "bookCoverSize" src={singleProduct?.images} alt={singleProduct.id} /></th>
                                </tr>
                                <tr> 
                                <th scope="row">Description</th>
                                <th scope="row">{singleProduct?.description}</th>
                                </tr>
                                <tr> 
                                <th scope="row">Price</th>
                                <th scope="row">$ {singleProduct?.price}</th>
                                </tr>
                                </React.Fragment>
                            : (<tr><td colSpan="7">There is no product.</td></tr>)
                        }
                                <tr> 
                                    <th colSpan = "2" scope="row">
                                        <button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(singleProduct.id, 1)}>Cart</button>
                                        <button className="btn btn-primary" type="submit" style={{margin: '5px'}}onClick={()=>order(singleProduct.id, 1)}>Order</button>
                                    </th>
                                </tr>

                            </tbody>
                        </table> 

                            
                            
                </div>


            </div>
        </div>
           
        </>
    );
}