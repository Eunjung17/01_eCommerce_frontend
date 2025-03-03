/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect  } from "react";
import { useProductFromKeywordMutation } from '../../redux/slices/productSlice'
import { useAddCartMutation } from '../../redux/slices/cartSlice'

import './SearchProduct.css';

export default function SearchProduct({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchKeyword = null } = location.state || {};
    console.log("searchKeyword: ", searchKeyword);

    const [ addCartApi, {isLoading2, error2}] = useAddCartMutation();
    const [ products, {isLoading, error}] = useProductFromKeywordMutation();
    const [keywordData, setKeywordData] = useState(null);
    const [ alert, setAlert ] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        
        console.log("searchKeyword", searchKeyword);
        if(searchKeyword){
            const fetchOrderDetails = async () => {

                try {
                    const response = await products({searchKeyword}).unwrap(); 
                    console.log("response: ", response);
                    setKeywordData(response);

                } catch (error) {
                    setAlert("something wrong.");
                    console.log(error);
                }
        };

        fetchOrderDetails();
        }

    }, [searchKeyword, token]);

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

                    <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Category</th>
                                <th scope="col">Name</th>
                                <th scope="col">Image</th>
                                <th scope="col">Description</th>
                                <th scope="col">Price</th>
                                <th scope="col">Add to Cart</th>
                                <th scope="col">Buy Now</th>
                            </tr>
                            </thead>
                            <tbody className="table-group-divider">
                            {isLoading && <tr><td colSpan="6">Loading Cart...</td></tr>}
                            {!isLoading && keywordData ? (
                                keywordData.map((p) => (
                                <tr key={p.id}>
                                    <th scope="row">{p?.categoryDetail?.category?.name} &gt; {p?.categoryDetail?.name}</th>
                                    <th scope="row">{p?.name}</th>
                                    <td><img className = "bookCoverSize" src={p?.images} alt={p.id} /></td>
                                    <td><h6>{p?.description}</h6></td>
                                    <td><h6>$ {p?.price}</h6></td>
                                    <td><button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(p.id, 1)}>Cart</button></td>
                                    <td><button className="btn btn-primary" type="submit" style={{margin: '5px'}}onClick={()=>order(p.id, 1)}>Order</button></td>
                                </tr>
                                    ))
                                    ) : (
                                    <tr><td colSpan="6">There is no product.</td></tr>
                                )}
                            </tbody>
                        </table>

                            
                            
                </div>


            </div>
        </div>
           
        </>
    );
}