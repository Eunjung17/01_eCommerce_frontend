/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState  } from "react";
// import { useGetUserRoleQuery, useGetAllUserQuery, useConfirmUserMutation } from '../../redux/slices/userSlice'
import { useGetCartAllQuery, useDeleteCartMutation, useChangeQuantityMutation, useDeleteEachCartDetailMutation } from '../../redux/slices/cartSlice'

import './UserCart.css';

export default function UserCart({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();

    const { data: cartAll, isLoading, error } = useGetCartAllQuery(token);
    const [ deleteCart, {isLoading3, error3}] = useDeleteCartMutation();
    const [ changeQuantityAPI, {isLoading2, error2}] = useChangeQuantityMutation();
    const [ deleteEachCartDetailAPI, {isLoading4, error4}] = useDeleteEachCartDetailMutation();

    const [fadeOut, setFadeOut] = useState(false);
    const [ alert, setAlert ] = useState(null);

    const [ orderData, setOrderData] = useState({
        newName: '',
        newAddress: '',
        newPhone: '',
        paymentMethod: '0',
        quantities: {},
        totalPrices: {}, 
    });
    
    const handleClose = () => {

        setFadeOut(true);
        setTimeout(() => {
            setAlert("");
            setFadeOut(false);
        }, 600);
    }


    const cancel  = () => {
        navigate("/");
    }

    const moveToOrder  = () => {
        if(cartAll.length ===0) return setAlert("There is no cart to order.");
        navigate("/UserCartOrder");
    }
    
    const clearCart  = async () => {

        if(cartAll.length ===0) return setAlert("There is no cart to clear.");

        return await deleteCart({token}).unwrap(); 
    }

    const deleteEachCartDetail  = async (cartDetailId) => {

        if(cartAll.length ===0) return setAlert("There is no cart to clear.");

        return await deleteEachCartDetailAPI({ token , cartDetailId }).unwrap(); 
    }

    const handleQuantityChange = async (quantity, price, cartDetailId) => {
        
        return await changeQuantityAPI({token, quantity, cartDetailId}).unwrap(); 
    };


    if (isLoading || isLoading2 || isLoading3 || isLoading4) return <div>Loading categories...</div>;
    if (error || error2 || error3 || error4) return <div>Error loading categories</div>;

    return(
        <>
            <div className="row">
                <div className="middle2column">
                    <div className="card">
 
                    {alert &&
                                <div id="notification" className={`alert warning ${fadeOut ? 'fade-out' : ''}`} onClick={handleClose}>
                                    <span className="closebtn">&times;</span>  
                                    <strong>Warning!</strong> {alert}
                                </div>
                    }
                        <h5 className="card-title"><i><u>In My Cart</u></i></h5>
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Category</th>
                                <th scope="col">Name</th>
                                <th scope="col">Image</th>
                                <th scope="col" style={{width:'300px'}} >Description</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody className="table-group-divider">
                            {isLoading && <tr><td colSpan="6">Loading Cart...</td></tr>}
                            {!isLoading && cartAll ? (
                                cartAll.map((p) => (
                                <tr key={p.id}>
                                    <th scope="row">{p?.product?.categoryDetail?.category?.name} &gt; {p?.product?.categoryDetail?.name}</th>
                                    <th scope="row">{p?.product?.name}</th>
                                    <td><img className = "bookCoverSize" src={p?.product?.images} alt={p.id} /></td>
                                    <td><h6>{p?.product?.description}</h6></td>
                                    <td><h6>$ {p?.product?.price}</h6></td>
                                    <td>
                                        <select onChange={(e) => handleQuantityChange(e.target.value, p?.product?.price, p.id)} value={p.quantity} name={p.id} className="form-select" aria-label="Default select example">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        </select>
                                    </td>
                                    <td>$ {p.quantity * p?.product?.price}</td>
                                    <td><button type="button" className="btn btn-primary" style={{width:'80px'}} onClick={()=>deleteEachCartDetail(p.id)}>Delete</button></td>
                                </tr>
                                    ))
                                    ) : (
                                    <tr><td colSpan="6">There is no product.</td></tr>
                                )}
                            </tbody>
                        </table>

                        <div>
                        <button type="button" className="btn btn-primary btn-lg" style={{width:'150px', margin:'20px'}} onClick={()=>moveToOrder()}>Order</button>
                        <button type="button" className="btn btn-secondary btn-lg" style={{width:'150px', margin:'20px'}} onClick={()=>clearCart()}>Clear Cart</button>
                        <button type="button" className="btn btn-secondary btn-lg" style={{width:'150px', margin:'20px'}} onClick={()=>cancel()}>Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}