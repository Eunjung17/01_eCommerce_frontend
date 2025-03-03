import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from "react";
import { useGetCategoryAllQuery } from '../../redux/slices/categorySlice'
import { useGetTop4ProductQuery } from '../../redux/slices/productSlice'
import { useAddCartMutation } from '../../redux/slices/cartSlice'


export default function Navigation({token, setToken, userRole ,setUserRole}) {

    const navigate = useNavigate();
    const { data: categories, isLoading, error } = useGetCategoryAllQuery();
    const { data: top4Products, isLoading2, error2} = useGetTop4ProductQuery();
    const [ addCartApi, {isLoading3, error3}] = useAddCartMutation();

    const [ alert, setAlert ] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);
    
    const [activeIndex, setActiveIndex] = useState(null); 
    const [searchKeyword, setSearchKeyword] = useState(""); 
    const [showModal, setShowModal] = useState(false);

    // Toggle the panel based on the index
    const togglePanel = (index) => {
        setAlert(null);
        setActiveIndex(activeIndex === index ? null : index); // Close if already open, open if closed
    };


    const cart = async (productId, quantity) => {

        setAlert(null);

        if(!token){
            return openModal();
        }

        if(userRole === '2') setAlert("Business user can't order products."); 
        else if(userRole === '3') setAlert("Admin user can't order products."); 
        else{

            const response = await addCartApi({token, productId, quantity}).unwrap(); 

            navigate("/UserCart");
        }

    }

    
    const search  = () => {

        setAlert(null);
            navigate("/SearchProduct", {state: {searchKeyword: searchKeyword}});
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

    const categoryDetailSelection  = (e, id) => {
        e.preventDefault();
        setAlert(null);
        navigate("/ProductCategoryList", {
            state: {categoryDetailId: id}
        });
    }

    const productDetail  = (productId, quantity) => {

        setAlert(null);

        navigate("/SingleProduct", {
            state: {productId: productId}
        });
    }

    
    const handleClose = () => {

        setFadeOut(true);
        setTimeout(() => {
            setAlert("");
            setFadeOut(false);
        }, 600);
    }



    const openModal = () => setShowModal(true);

    const closeModal = () => setShowModal(false);

    if (isLoading || isLoading2 || isLoading3) return <div>Loading categories...</div>;
    if (error || error2 || error3) return <div>Error loading categories</div>;

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


            {alert &&
                            <div id="notification" className={`alert warning ${fadeOut ? 'fade-out' : ''}`} onClick={handleClose}>
                                <span className="closebtn">&times;</span>  
                                <strong>Warning!</strong> {alert}
                            </div>
            }

            <div className="leftcolumn">
                <div className="accordion0"><h3>Category</h3></div>
            {categories && categories.map(category => (            
                <div key={category.id} >
                    <button className="accordion" onClick={()=>togglePanel(`index${category.id}`)}>
                        {category.name}
                    </button>
                    {category && category.categoryDetail.map(detail => (
                        <div key={detail.id} className="panel" style={{display:activeIndex === `index${category.id}` ? 'block': 'none'}} >
                            <p><a onClick={(e)=>categoryDetailSelection(e,detail.id)}>{detail.name}</a></p>
                        </div>
                    ))}
    
                </div>
                ))}
            </div>

            <div className="middlecolumn">

                <div className="card">
                <h3>Popular Post</h3>
            {top4Products && top4Products.length > 0 &&
                <>
                <h2>{top4Products[0].name}</h2>
                <div className="fakeimg" style={{height:'220px', display:'flex'}}>
                    <img className = "bookCoverSize" src={top4Products[0].images} alt={top4Products[0].id} />
                    <div>
                        <p>{top4Products[0].description}</p>
                        <h5>${top4Products[0].price}</h5>
                        <button type="button" className="btn btn-secondary" style={{margin: '5px'}} onClick={()=>productDetail(top4Products[0].id, 1)}>Detail</button>
                        <button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(top4Products[0].id, 1)}>Cart</button>
                        <button className="btn btn-primary" type="submit" style={{margin: '5px'}} onClick={()=>order(top4Products[0].id, 1)}>Order</button>
                    </div>
                </div>
                </>
            }
                </div>
                <div className="card">
                <h3>Popular Post</h3>
                {top4Products && top4Products.length > 1 &&
                <>
                <h2>{top4Products[1].name}</h2>
                <div className="fakeimg" style={{height:'220px', display:'flex'}}>
                    <img className = "bookCoverSize" src={top4Products[1].images} alt={top4Products[1].id} />
                    <div>
                        <p>{top4Products[1].description}</p>
                        <h5>${top4Products[1].price}</h5>
                        <button type="button" className="btn btn-secondary" style={{margin: '5px'}} onClick={()=>productDetail(top4Products[1].id, 1)}>Detail</button>
                        <button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(top4Products[1].id, 1)}>Cart</button>
                        <button className="btn btn-primary" type="submit" style={{margin: '5px'}} onClick={()=>order(top4Products[1].id, 1)}>Order</button>
                    </div>
                </div>
                </>
            }</div>
            </div>
            <div className="rightcolumn">
                <div className="card">
                    <div style={{display:'flex',float:'right',margin:'20px'}}>
                        <input className="form-control mr-sm-2" name="search" value={searchKeyword} onChange={(e)=>setSearchKeyword(e.target.value)} type="search" placeholder="Search" aria-label="Search" style={{ marginRight: '10px' }} />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={search}>Search</button>
                    </div>
                </div>
                <div className="card">
                <h3>Popular Post</h3>
                {top4Products && top4Products.length > 2 &&
                <>
                <h2>{top4Products[2].name}</h2>
                <div className="fakeimg" style={{height:'200px', display:'flex'}}>
                    <img className = "bookCoverSize" src={top4Products[2].images} alt={top4Products[2].id} />
                    <div>
                        <p>{top4Products[2].description}</p>
                        <h5>${top4Products[2].price}</h5>
                        <button type="button" className="btn btn-secondary" style={{margin: '5px'}} onClick={()=>productDetail(top4Products[2].id, 1)}>Detail</button>
                        <button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(top4Products[2].id, 1)}>Cart</button>
                        <button className="btn btn-primary" type="submit" style={{margin: '5px'}} onClick={()=>order(top4Products[2].id, 1)}>Order</button>
                    </div>
                </div>
                </>
                }
                </div>
                <div className="card">
                <h3>Popular Post</h3>
                {top4Products && top4Products.length > 3 &&
                <>
                <h2>{top4Products[3].name}</h2>
                <div className="fakeimg" style={{height:'200px', display:'flex'}}>
                    <img className = "bookCoverSize" src={top4Products[3].images} alt={top4Products[3].id} />
                    <div>
                        <p>{top4Products[3].description}</p>
                        <h5>${top4Products[3].price}</h5>
                        <button type="button" className="btn btn-secondary" style={{margin: '5px'}} onClick={()=>productDetail(top4Products[3].id, 1)}>Detail</button>
                        <button className="btn btn-success" type="submit" style={{margin: '5px'}} onClick={()=>cart(top4Products[3].id, 1)}>Cart</button>
                        <button className="btn btn-primary" type="submit" style={{margin: '5px'}} onClick={()=>order(top4Products[3].id, 1)}>Order</button>
                    </div>
                </div>
                </>
                }
                </div>
            </div>
        </div>
    </>
    );
}