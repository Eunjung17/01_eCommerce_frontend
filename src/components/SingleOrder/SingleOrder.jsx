
/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect  } from "react";
import { useGetUserInfoQuery } from '../../redux/slices/userSlice'
import { useGetPaymentMethodQuery, useRegisterSingleOrderMutation } from '../../redux/slices/orderSlice'
import { useSingleProductMutation } from '../../redux/slices/productSlice'

import './SingleOrder.css';

export default function Order({token, setToken, userRole, setUserRole}) {
    const navigate = useNavigate();
    console.log("token userRole start ", token, userRole);
    const location = useLocation();
    const { productId = null } = location.state || {};
    console.log("productId in UserOrderDetail 222: ", productId);

    const { data: userInfo, isLoading2, error2 } = useGetUserInfoQuery(token);
    const { data: paymentMethod, isLoading3, error3 } = useGetPaymentMethodQuery(token);
    const [singleProduct, {isLoading, error}] = useSingleProductMutation();
    const [registerSingleProduct, {isLoading4, error4}] = useRegisterSingleOrderMutation();

    const [fadeOut, setFadeOut] = useState(false);
    const [ alert, setAlert ] = useState(null);
    const [ buttonFlag, setButtonFlag ] = useState(null);
    const [ addressFlag, setAddressFlag ] = useState(null);
    const [ nameFlag, setNameFlag ] = useState(null);
    const [ phoneFlag, setPhoneFlag ] = useState(null);
    const [ productResult, setProductResult ] = useState(null);
    const [ selectQuantity, setSelectQuantity ] = useState(0);

    const [ orderData, setOrderData] = useState({
        productId: '',
        orderQuantity:0,
        newName: '',
        newAddress: '',
        newPhone: '',
        paymentMethod: '0',
    });



    const handleClose = () => {

        setFadeOut(true);
        setTimeout(() => {
            setAlert("");
            setFadeOut(false);
        }, 600);
    }

    useEffect(() => {
            

        if(productId && token){
            const fetchOrderDetails = async () => {
                console.log("productId && token: ", productId ," ::: ", token);   
                try {
                    const response = await singleProduct({token, productId}).unwrap(); 
                    console.log("productId response: ", response);
                    setProductResult(response);

                } catch (error) {
                    setAlert("something wrong.");
                    console.log(error);
                }
        };

        fetchOrderDetails();
        }

    }, []);

    const showOrderInfo  = () => {

        setAlert(null);

        setButtonFlag("noShow");
        if(!token ||!userRole) setAlert("Login required.");
        else{

            setOrderData(prevOrderData => {
                let updatedOrderData = { ...prevOrderData };

                
                if (updatedOrderData.orderQuantity === 0) {
                    updatedOrderData.orderQuantity = (selectQuantity ? selectQuantity : 1);
                }
                updatedOrderData.newName = userInfo?.firstName + " " + userInfo?.lastName;
                updatedOrderData.productId = productResult?.id;

                if (updatedOrderData.newName === '') {
                    updatedOrderData.newName = userInfo?.firstName + " " + userInfo?.lastName;
                }
                if (updatedOrderData.newAddress === '') {
                    updatedOrderData.newAddress = userInfo?.address;
                }
                if (updatedOrderData.newPhone === '') {
                    updatedOrderData.newPhone = userInfo?.phone;
                }
    
                return updatedOrderData; // Return the updated orderData to be set
            });
        }

    }


    const placeOrder  = async () => { 


        setAlert(null);

        if(orderData.orderQuantity===0) return setAlert("You must order at least 1 item.");

        if(!token ||!userRole) return setAlert("Login required.");

        if(orderData.paymentMethod === "0"){

            return setAlert("Select payment method to order.");
        }
 

        setOrderData(prevOrderData => {
            let updatedOrderData = { ...prevOrderData };
            updatedOrderData.orderQuantity = selectQuantity;

            updatedOrderData; // Return the updated orderData to be set
            console.log("orderData!!" , orderData);
        });


        console.log("orderData:::" , orderData);

        const response = await registerSingleProduct({token, orderData}).unwrap(); 


        navigate(`/UserOrderDetail`, {
            state: { orderId: response.id }
        });
    }

    const cancel  = () => {
        navigate("/");
    }

    const addressChange  = () => {
        setAddressFlag("change");
    }
    
    const nameChange  = () => {
        setNameFlag("change");
    }
    
    const phoneChange  = () => {
        setPhoneFlag("change");
    }

    const handleChange = (e) => {

        setOrderData({...orderData, [e.target.name]: e.target.value});

        if (e.target.name === "orderQuantity") {
            setSelectQuantity(e.target.value);
        }
    }

    if (isLoading || isLoading2 || isLoading3 || isLoading4) return <div>Loading categories...</div>;
    if (error || error2 || error3 || error4) return <div>Error loading categories</div>;

    return(
        <>
            <div className="row">
                <div className="middle2column">
                    <div className="card">
 
                        {alert &&
                            <div>{alert}</div> 
                        }
                        <h5 className="card-title"><i>Ready To Order</i></h5>
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
                            
                            <tr>
                                <th scope="col">{productResult?.categoryDetail?.category?.name}</th>
                                <th scope="col">{productResult?.name}</th>
                                <th scope="col"><img className = "bookCoverSize" src={productResult?.images} alt={productResult?.id} /></th>
                                <th scope="col">{productResult?.description}</th>
                                <th scope="col">{productResult?.price}</th>
                                <th scope="col">
                                    <select onChange={handleChange} value={orderData?.orderQuantity} name="orderQuantity" className="form-select" aria-label="Default select example">
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
                                </th>
                                <th scope="col">{selectQuantity ? productResult?.price * selectQuantity : productResult?.price}</th>
                            </tr>
                            </tbody>
                        </table>
                    
                    {!buttonFlag ?
                        <button type="button" className="btn btn-primary btn-lg" style={{width:'100px', margin:'20px'}} onClick={()=>showOrderInfo()}>Order</button>
                        :
                        <>
                            <h5 className="card-title"><i>Proceed To Checkout</i></h5>


                            <table className="table">
                                <thead className="table-info">
                                    <tr>
                                    <th scope="col"># Title</th>
                                    <th scope="col"># Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <th scope="row">+ Total Quantity</th>
                                    <td>{orderData?.orderQuantity ? orderData?.orderQuantity : 1}</td>
                                    </tr>
                                    <tr>
                                    <th scope="col">+ Total Price</th>
                                    <th scope="col">$ {productResult?.price && selectQuantity ? productResult?.price * selectQuantity : productResult?.price}</th>
                                    </tr>
                                    <tr>
                                    <th scope="col">+ Recipient</th>
                                    <th scope="col">
                                    {!nameFlag ?
                                            <>
                                                <h6>{userInfo?.firstName+" "+userInfo?.lastName}</h6>
                                                <button type="button" className="btn btn-secondary" style={{margin: '0px'}} onClick={nameChange} >Change Name</button>
                                            </> 
                                            :
                                                <input type="newName" className="form-control" id="newName" name="newName" placeholder="Enter New Name" value={orderData?.newName} onChange={handleChange}   required/>
                                    }
                                    </th>
                                    </tr>
                                    <tr>
                                    <th scope="col">+ contact number</th>
                                    <th scope="col">
                                    {!phoneFlag ?
                                            <>
                                                <h6>{userInfo?.phone}</h6>
                                                <button type="button" className="btn btn-secondary" style={{margin: '0px'}} onClick={phoneChange} >Change phone Number</button>
                                            </> 
                                            :
                                                <input type="newPhone" className="form-control" id="newPhone" name="newPhone" placeholder="Enter New Phone number" value={orderData?.newPhone} onChange={handleChange}   required/>
                                    }
                                    </th>
                                    </tr>
                                    <tr>
                                    <th scope="row">+ Address</th>
                                    <td>
                                    {!addressFlag ?
                                            <>
                                                <h6>{userInfo?.address}</h6>
                                                <button type="button" className="btn btn-secondary" style={{margin: '0px'}} onClick={addressChange} >Change Address</button>
                                            </> 
                                            :
                                                <input type="newAddress" className="form-control" id="newAddress" name="newAddress" placeholder="Enter the Address" value={orderData.newAddress} onChange={handleChange}   required/>
                                    }
                                    </td>
                                    </tr>
                                    <tr>
                                    <th scope="row">+ Payment</th>
                                    <td>
                                        <select className="form-select" name="paymentMethod" value={orderData?.paymentMethod} onChange={handleChange} aria-label="Default select example" style={{width: '250px'}}>
                                            <option value="0">Choose payment Method</option>
                                        {paymentMethod && paymentMethod?.map(p=>(
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                        </select>
                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                            {alert &&
                                <div id="notification" className={`alert warning ${fadeOut ? 'fade-out' : ''}`} onClick={handleClose}>
                                    <span className="closebtn">&times;</span>  
                                    <strong>Warning!</strong> {alert}
                                </div>
                            }
                            <div>
                                <button type="button" className="btn btn-primary btn-lg" style={{width:'250px', margin:'20px'}} onClick={placeOrder}>Pay & Place My Order</button>
                                <button type="button" className="btn btn-primary btn-lg" style={{width:'200px', margin:'20px'}} onClick={cancel}>Cancel My Order</button>
                            </div>
                        </>                        

                    }
                            
                    </div>
                </div>
            </div>
        </>
    );
}