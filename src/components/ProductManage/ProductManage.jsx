/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useGetUserRoleQuery, useGetAllUserQuery, useConfirmUserMutation } from '../../redux/slices/userSlice'
import { useGetCategoryAllQuery } from '../../redux/slices/categorySlice'
import { useGetAllProductQuery, useDeleteProductMutation, useGetAllDeletedProductQuery, useRecoveryProductMutation, useRegisterProductMutation } from '../../redux/slices/productSlice'
import './ProductManage.css';

export default function ProductDetail({token, setToken, userRole, setUserRole}) {

    const navigate = useNavigate()
    const { data: categories, isLoading1, error1 } = useGetCategoryAllQuery(token);
    const { data: allProduct, isLoading2, error2 } = useGetAllProductQuery(token);
    const { data: allDeletedProduct, isLoading4, error4 } = useGetAllDeletedProductQuery(token);
    const [ registerProductAPI, {isLoading6, error6}] = useRegisterProductMutation();
    
    const [ deleteProductAPI, {isLoading3, error3}] = useDeleteProductMutation();
    const [ recoveryProductAPI, {isLoading5, error5}] = useRecoveryProductMutation();

    const [activeTab, setActiveTab] = useState("nav-home");

    const [activeIndex, setActiveIndex] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    // const [showModal2, setShowModal2] = useState(false);
    const [productId, setProductId] = useState(false);
    const [ alert, setAlert ] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);

    const [ productData, setProductData] = useState({
        mainCategory: '',
        subCategory: '',
        name: '',
        description: '',
        images: '',
        quantity:0,
        price:0,
    });

    const saveProduct  = async () => { 

      if(!productData.mainCategory || !productData.subCategory || !productData.name || !productData.description || productData.quantity === 0 || productData.price === 0){
        setAlert('Please fill in all fields.');
        return;
      }

      if(productData.quantity <= 0 || productData.price <= 0){
        setAlert('You must input number greater than 0.');
        return;
      }
      const response = await registerProductAPI({token, productData}).unwrap(); 
      
      // setShowModal2(true);
      handleTabClick("nav-home")

  }

  const cancel  = () => {
      navigate("/");
  }

  const deleteConfirm  = async (id) => {

      setProductId(id);
      return setShowModal(true);
}

  const deleteProduct  = async () => {

    const response = await deleteProductAPI({token, productId}).unwrap(); 
    setShowModal(false);
    return setActiveTab("nav-contact");
  }


  const dataRecovery  = async (id) => {
    
        const response = await recoveryProductAPI({token, id}).unwrap(); 
        setShowModal(false);
        return setActiveTab("nav-home");
    }


    const togglePanel = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoading5 || isLoading6) return <div>Loading categories...</div>;
    if (error1 || error2 || error3 || error4 || error5 || error6) return <div>Error loading categories</div>;


    const handleTabClick = (tabId) => {
        setActiveTab(tabId); 
    };
    
    const handleClose = () => {

      if(alert){
        setFadeOut(true);
        setTimeout(() => {
            setAlert("");
            setFadeOut(false);
        }, 600);
      }

  }

    const openModal = () => {
      if(!showModal){
        setShowModal(true);
      }
    }

    const closeModal = () => {
      if(!showModal){
        setShowModal(true);
      }
    }

    const handleChange = (e) => {
      setAlert("");

      setProductData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
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
                        <p>Are you sure that you want to delete this item?</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary"onClick={deleteProduct}>Yes</button> 
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

                    <h5 className="card-title"><i><u>Product Management</u></i></h5>&nbsp;
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button 
                                className={`nav-link ${activeTab === "nav-home" ? "active" : ""}`} 
                                id="nav-home-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#nav-home" 
                                type="button" 
                                role="tab" 
                                aria-controls="nav-home" 
                                aria-selected={activeTab === "nav-home"}
                                onClick={() => handleTabClick("nav-home")}
                            >
                                Registered Product
                            </button>
                            <button 
                                className={`nav-link ${activeTab === "nav-profile" ? "active" : ""}`} 
                                id="nav-profile-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#nav-profile" 
                                type="button" 
                                role="tab" 
                                aria-controls="nav-profile" 
                                aria-selected={activeTab === "nav-profile"}
                                onClick={() => handleTabClick("nav-profile")}
                            >
                                New Product Registration
                            </button>
                            <button 
                                className={`nav-link ${activeTab === "nav-contact" ? "active" : ""}`} 
                                id="nav-contact-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#nav-contact" 
                                type="button" 
                                role="tab" 
                                aria-controls="nav-contact" 
                                aria-selected={activeTab === "nav-contact"}
                                onClick={() => handleTabClick("nav-contact")}
                            >
                                Deleted Product
                            </button>
                        </div>
                    </nav>

                    <div className="tab-content" id="nav-tabContent">

                        <div 
                            className={`tab-pane fade ${activeTab === "nav-home" ? "show active" : ""}`} 
                            id="nav-home" 
                            role="tabpanel" 
                            aria-labelledby="nav-home-tab"
                        >

                            <table className="table table-hover table-group-divider">
                                <thead>
                                  <tr>
                                    <th scope="col">Category</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Delete Product</th>
                                  </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                  {isLoading2 && <tr><td colSpan="6">Loading Books...</td></tr>}
                                  {!isLoading2 && allProduct ? (
                                    allProduct.map((p) => (
                                      <tr key={p.id}>
                                        <th scope="row">{p?.categoryDetail?.category?.name} &gt; {p?.categoryDetail?.name}</th>
                                        <th scope="row">{p.name}</th>
                                        <td><img className="bookCoverSize" src={p.images} alt={p.id} /></td>
                                        <td><h6>{p.description}</h6></td>
                                        <td><h6>${p.price}</h6></td>
                                        <td>{p.quantity}</td>
                                        <td><button type="button" className="btn btn-warning" style={{width:'100px', margin:'20px'}} onClick={()=>deleteConfirm(p?.id)}>Delete</button></td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr><td colSpan="7">There is no product.</td></tr>
                                  )}
                                </tbody>
                            </table>
                        </div>


                        <div 
                            className={`tab-pane fade ${activeTab === "nav-profile" ? "show active" : ""}`} 
                            id="nav-profile" 
                            role="tabpanel" 
                            aria-labelledby="nav-profile-tab"
                        >

                            <table className="table table-hover">

                                <tbody className="table-group-divider">
                                      <tr>
                                        <th scope="row">Main Category</th>
                                        <th scope="row">
                                          <select className="form-select" name="mainCategory" value={productData.mainCategory || ''} onChange={handleChange} aria-label="Default select example" style={{width: '250px'}}>
                                              <option value="0">Choose main category</option>
                                          {categories && categories?.map(p=>(
                                              <option key={p.id} value={p.id}>{p.name}</option>
                                          ))}
                                          </select>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th scope="row">Sub Category</th>
                                        <th scope="row">
                                          <select className="form-select" name="subCategory" value={productData.subCategory || ''} onChange={handleChange} aria-label="Default select example" style={{width: '250px'}}>
                                                <option value="0">Choose sub category</option>
                                            {categories && categories
                                              .filter(category=>category.id === productData.mainCategory)
                                              .map(category=>category.categoryDetail.map(detail=>
                                                <option key={detail.id} value={detail.id}>{detail.name}</option>
                                            ))}
                                          </select>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th scope="row">Product Name</th>
                                        <th scope="row">
                                          <input type="name" className="form-control" id="name" name="name" value={productData.name} onChange={handleChange} aria-describedby="emailHelp" placeholder=""/>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th scope="row">Product Description</th>
                                        <th scope="row">
                                          <input type="description" className="form-control" id="description" name="description" value={productData.description} onChange={handleChange} aria-describedby="emailHelp" placeholder=""/>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th scope="row">Images</th>
                                        <th scope="row">
                                          <input type="images" className="form-control" id="images" name="images" value={productData.images} onChange={handleChange} aria-describedby="emailHelp" placeholder=""/>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th scope="row">Price</th>
                                        <th scope="row">
                                          <input type="price" className="form-control" id="price" name="price" value={productData.price} onChange={handleChange} aria-describedby="emailHelp" placeholder=""/>
                                        </th>
                                      </tr>
                                      <tr>
                                        <th scope="row">Quantity</th>
                                        <th scope="row">
                                          <input type="quantity" className="form-control" id="quantity" name="quantity" value={productData.quantity} onChange={handleChange} aria-describedby="emailHelp" placeholder=""/>
                                        </th>
                                      </tr>
                                      <tr>
                                        <td colSpan="2">
                                          <button type="button" className="btn btn-primary btn-lg" style={{width:'200px', margin:'20px'}} onClick={saveProduct}>Save</button>
                                          <button type="button" className="btn btn-primary btn-lg" style={{width:'200px', margin:'20px'}} onClick={cancel}>Cancel</button>
                                        </td>
                                      </tr>
                                </tbody>
                            </table>

                        </div>

                         
                        <div 
                            className={`tab-pane fade ${activeTab === "nav-contact" ? "show active" : ""}`} 
                            id="nav-contact" 
                            role="tabpanel" 
                            aria-labelledby="nav-contact-tab"
                        >

                            <table className="table table-hover table-group-divider">
                                <thead>
                                  <tr>
                                    <th scope="col">Category</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Return this Product</th>
                                  </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                  {isLoading4 && <tr><td colSpan="6">Loading Books...</td></tr>}
                                  {!isLoading4 && allDeletedProduct ? (
                                    allDeletedProduct.map((p) => (
                                      <tr key={p.id}>
                                        <th scope="row">{p?.categoryDetail?.category?.name} &gt; {p?.categoryDetail?.name}</th>
                                        <th scope="row">{p.name}</th>
                                        <td><img className="bookCoverSize" src={p.images} alt={p.id} /></td>
                                        <td><h6>{p.description}</h6></td>
                                        <td><h6>${p.price}</h6></td>
                                        <td>{p.quantity}</td>
                                        <td><button type="button" className="btn btn-warning" style={{width:'100px', margin:'20px'}} onClick={()=>dataRecovery(p.id)}>Return</button></td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr><td colSpan="7">There is no product.</td></tr>
                                  )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
        </>
    );
}
