/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetOrderHistoryQuery } from "../../redux/slices/orderSlice";

import "./UserOrderHistory.css";

export default function UserOrderHistory({
  token,
  setToken,
  userRole,
  setUserRole,
}) {

  const navigate = useNavigate();

  const {
    data: orderHistory,
    isLoading,
    error,
  } = useGetOrderHistoryQuery(token);
  const [alert, setAlert] = useState(null);
  const [orderIdChoose, setOrderIdChoose] = useState(null);

  const handleClick = (e, id) => {
    e.preventDefault();

    setOrderIdChoose(id);
  };

  const moveToHome = () => {
    navigate("/");
  };


  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <>
      <div className="card">
        <div className="row">


        <div className="left">
            <h5 className="card-title">
              <i><u>Order History</u></i>
            </h5>
            <table className="table table-hover">
              <thead></thead>
              <tbody className="table-group-divider">
                {!isLoading &&
                  !error &&
                  orderHistory &&
                  orderHistory.map((order) => (
                    <React.Fragment key={order?.id}>
                      <tr>
                        <th scope="col">Order ID: <a href="#" onClick={(e)=>handleClick(e, order?.id)}>{order?.id}</a></th>
                        <th scope="col">
                          Date:{" "}
                          {order?.createdAt
                            ? new Date(order?.createdAt)
                                .toISOString()
                                .substring(0, 10)
                            : "N/A"}
                        </th>
                      </tr>

                      {order?.orderDetails &&
                        order?.orderDetails.length > 0 && (
                          <tr>
                            <td colSpan="2" scope="col">
                              {order?.orderDetails.map((orderDetail) => (
                                <img
                                  key={orderDetail.id}
                                  className="bookCoverSize"
                                  src={orderDetail?.product?.images}
                                  alt={orderDetail?.product?.name}
                                />
                              ))}
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>



          <div className="right">
            {orderIdChoose &&
            <>
             <h5 className="card-title">
            <i>Order Detail</i>
            </h5>
            <table className="table table-hover">
              <thead></thead>
              <tbody className="table-group-divider">
                <tr>
                  <td scope="col">Name</td>
                  <td scope="col"></td>
                  <td scope="col">Quantity</td>
                  <td scope="col">Total Price</td>
                </tr>

                {orderHistory && orderHistory.filter(order => order.id === orderIdChoose).map((order)=>(
                    order.orderDetails.map((orderDetail) => (
                        <tr key={orderDetail.id}>
                            <td scope="col">{orderDetail.product.name}</td>
                            <td scope="col">            
                                <img
                                  key={orderDetail.id}
                                  className="bookCoverSize2"
                                  src={orderDetail?.product?.images}
                                  alt={orderDetail?.product?.name}
                                />
                            </td>
                            <td scope="col">{orderDetail.quantity}</td>
                            <td scope="col">$ {orderDetail.price * orderDetail.quantity}</td>
                        </tr>
                      ))
                ))}

              </tbody>
            </table>

            {!isLoading &&
                  !error &&
                  orderHistory &&
                  orderHistory.filter(order => order.id === orderIdChoose).map((order) => (
            <table key ={order.id} className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Detail</th>
                    </tr>
                </thead>
                <tbody>
                    
                    <tr>
                    <th scope="row">Recipient</th>
                    <td>{order?.name}</td>
                    </tr>
                    <tr>
                    <th scope="row">Phone</th>
                    <td>{order?.phone}</td>
                    </tr>
                    <tr>
                    <th scope="row">Address</th>
                    <td>{order?.address}</td>
                    </tr>
                    <tr>
                    <th scope="row">Payment</th>
                    <td>{order?.paymentMethod.name}</td>
                    </tr>
                    <tr>
                    <th scope="row">Total Price</th>
                    <td > $ 
                    {order && order.orderDetails && order.orderDetails.reduce((acc,orderDetail)=> acc + ( orderDetail.price * orderDetail.quantity ),0) }
                    </td>
                    </tr>
                </tbody>
            </table>
                  ))}
            </>

            }
          </div>



          <div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: "250px", margin: "20px" }}
              onClick={moveToHome}
            >
              Move to Home
            </button>
          </div>



        </div>
      </div>
    </>
  );
}
