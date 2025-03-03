/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect  } from "react";
import { useOrderDetailsMutation } from "../../redux/slices/orderSlice";


import './UserOrderDetail.css';

export default function UserOrderDetail({token, setToken, userRole, setUserRole}) {

    const navigate = useNavigate();
    const location = useLocation();
    const { orderId = null } = location.state || {};

    const [ orderDetail, {isLoading, error}] = useOrderDetailsMutation();
    const [ alert, setAlert ] = useState(null);
    const [orderData, setOrderData] = useState(null);

    const moveToHome  = () => {
        navigate("/");
    }

    useEffect(() => {
        

        if(orderId && token){
            const fetchOrderDetails = async () => {

                try {
                    const response = await orderDetail({token, orderId}).unwrap(); 

                    setOrderData(response);

                } catch (error) {
                    setAlert("something wrong.");
                    console.log(error);
                }
        };

        fetchOrderDetails();
        }

    }, [orderId, token]);



    if (isLoading) return <div>Loading categories...</div>;
    if (error) return <div>Error loading categories</div>;

    return(
        <>
            <div className="row">
                <div className="middle2column">
                    <div className="card">
 
                        {alert &&
                            <div>{alert}</div> 
                        }
                        <h5 className="card-title"><i>Successfully Ordered!</i></h5>
                        
                        <table className="table">
                            <thead className="table-info">
                                <tr>
                                <th scope="col"># Title</th>
                                <th scope="col"># Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="col">+ Order ID </th>
                                <th scope="col">{orderData && orderData?.id}</th>
                                </tr>
                                <tr>
                                <th scope="col">+ Recipient</th>
                                <th scope="col">{orderData && orderData?.name}</th>
                                </tr>
                                <tr>
                                <th scope="row">+ Address</th>
                                <td>{orderData && orderData?.address}</td>
                                </tr>
                                <tr>
                                <th scope="col">+ Phone</th>
                                <th scope="col"> {orderData && orderData?.phone}</th>
                                </tr>
                                <tr>
                                <th scope="col">+ Total Price</th>
                                <th scope="col">
                                    $ {orderData && orderData.orderDetails && orderData.orderDetails.reduce((total,order)=>{
                                        return total + (parseInt(order.price)*parseInt(order.quantity));
                                    },0)}
                                </th>
                                </tr>
                                <tr>
                                <th scope="col">+ Payment Method</th>
                                <th scope="col"> {orderData && orderData?.paymentMethod.name}</th>
                                </tr>                                   
                            </tbody>
                        </table>
                            
                        <h5 className="card-title"><i>Order List</i></h5>
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">Category</th>
                                <th scope="col">Name</th>
                                <th scope="col">Image</th>
                                <th scope="col">Description</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                            </tr>
                            </thead>
                            <tbody className="table-group-divider">
                            {isLoading && <tr><td colSpan="6">Loading Data...</td></tr>}
                            {!isLoading && orderData && orderData.orderDetails ? (
                                orderData && orderData.orderDetails.map((p) => (
                                <tr key={p.id}>
                                    <th scope="row">{p?.product?.categoryDetail?.category?.name}</th>
                                    <th scope="row">{p?.product?.name}</th>
                                    <td><img className = "bookCoverSize" src={p?.product?.images} alt={p.id} /></td>
                                    <td><h6>{p?.product?.description}</h6></td>
                                    <td><h6>$ {p?.product?.price}</h6></td>
                                    <td>{p.quantity}</td>
                                    <td>$ {p.quantity * p?.product?.price}</td>
                                </tr>
                                    ))
                                    ) : (
                                    <tr><td colSpan="6">There is no product.</td></tr>
                                )}
                            </tbody>
                        </table>
                        <div>
                                <button type="button" className="btn btn-primary btn-lg" style={{width:'250px', margin:'20px'}} onClick={moveToHome}>Move to Home</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}