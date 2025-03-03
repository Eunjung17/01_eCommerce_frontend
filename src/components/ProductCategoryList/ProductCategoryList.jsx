/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect  } from "react";
import { useProductFromCategoryMutation } from '../../redux/slices/productSlice'
import { useAddCartMutation } from '../../redux/slices/cartSlice'

import './ProductCategoryList.css';

export default function ProductCategoryList({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { categoryDetailId = null } = location.state || {};

    const [ addCartApi, {isLoading2, error2}] = useAddCartMutation();
    const [ products, {isLoading, error}] = useProductFromCategoryMutation();
    const [categoryData, setCategoryData] = useState(null);
    const [ alert, setAlert ] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        
        if(categoryDetailId){
            const fetchOrderDetails = async () => {

                try {
                    const response = await products({categoryDetailId}).unwrap(); 
                    setCategoryData(response);

                } catch (error) {
                    setAlert("something wrong.");
                    console.log(error);
                }
        };

        fetchOrderDetails();
        }

    }, [categoryDetailId, token]);

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

            navigate("/SingleOrder", {state: {productId:productId}});
        }
    }

    const openModal = () => setShowModal(true);

    const closeModal = () => setShowModal(false);


    if (isLoading || isLoading2) return <div>Loading categories...</div>;
    if (error || error2) return <div>Error loading categories</div>;



   
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
                        
                    </thead>
                    <tbody className="table-group-divider">
                    {isLoading && <tr><td colSpan="6">Loading Books...</td></tr>}
                    {
                        !isLoading && categoryData ? (
                            categoryData.map((p) => (
                            <React.Fragment key={p?.id}>
                                <tr>
                                <th scope="col">Category</th>
                                <th colSpan="4" scope="col">{p.category.name} &gt; {p.name}</th>
                                </tr>
                                <tr>
                                <td scope="row"></td>
                                <td colSpan="4" scope="row"><i>{p.description}</i></td>
                                </tr>
                                
                                <tr className="table-group-divider">
                                    <td>Product Name</td>
                                    <td>Image</td>
                                    <td style={{width:"30%"}}>Description</td>
                                    <td>Price</td>
                                    <td>Add to Cart</td>
                                    <td>Buy Now</td>
                                </tr>
                                {p.product && p.product.length > 0 ? (
                                p.product.map((product, index) => (
                                    <React.Fragment key={index}>
                                    <tr >
                                        <td>{product.name}</td>
                                        <td><img className = "bookCoverSize" src={product.images} alt={product.id} /></td>
                                        <td>{product.description}</td>
                                        <td>$ {product.price}</td>
                                        <td><button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(product.id, 1)}>Cart</button></td>
                                        <td><button className="btn btn-primary" type="submit" style={{margin: '5px'}} onClick={()=>order(product.id, 1)}>Order</button></td>

                                        
                                        
                                    </tr>
                                    </React.Fragment>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan="2">No products available</td>
                                </tr>
                                )}

                            </React.Fragment>
                            ))
                        ) : (
                            <tr><td colSpan="6">There is no product.</td></tr>
                        )
                        }
                    </tbody>
                </table>

                            
                            
                </div>


            </div>
        </div>
           
        </>
    );
}