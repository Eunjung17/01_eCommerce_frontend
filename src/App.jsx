import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Navigation from './components/Navigation/Navigation';
import AboutUs from './components/AboutUs/AboutUs';
import Footer from './components/Footer/Footer';
import SingleProduct from './components/SingleProduct/SingleProduct';
import SearchProduct from './components/SearchProduct/SearchProduct';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';
import SingleOrder from './components/SingleOrder/SingleOrder';
import ProductCategoryList from './components/ProductCategoryList/ProductCategoryList';
import ProductManage from './components/ProductManage/ProductManage';
import Registration from './components/Registration/Registration';
import UserCart from './components/UserCart/UserCart';
import UserProfile from './components/UserProfile/UserProfile';
import UserCartOrder from './components/UserCart/UserCartOrder';
import UserDetail from './components/UserDetail/UserDetail';
import UserOrderDetail from './components/UserOrderDetail/UserOrderDetail';
import UserOrderHistory from './components/UserOrderHistory/UserOrderHistory';
import UserManage from './components/UserManage/UserManage';
 import { useState, useEffect } from 'react';

import {store} from "./redux/store";
import { Provider } from "react-redux";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ?? null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') ?? null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') ?? null);

  //?? null: Only falls back to null if the value is null or undefined.
  //|| null: Falls back to null for any falsy value, including "" (empty string), false, 0, NaN, etc.

  useEffect(()=>{
    if(token){
      localStorage.setItem('token', token);
    } 
    else{
      localStorage.removeItem('token');
    }
  },[token]);

  useEffect(()=>{
    if(userRole){
      localStorage.setItem('userRole', userRole);
    } 
    else{
      localStorage.removeItem('userRole');
    }
  },[userRole]);

  useEffect(()=>{
    if(userEmail){
      localStorage.setItem('userEmail', userEmail);
    } 
    else{
      localStorage.removeItem('userEmail');
    }
  },[userEmail]);

  return (
    <>
      <Provider store={store}>
        <Router>
          <Navigation path="/Navigation" token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole} userEmail={userEmail}/>
          <Routes>
            <Route path="/" element={<Home token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/AboutUs" element={<AboutUs token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/SingleProduct" element={<SingleProduct token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/SearchProduct" element={<SearchProduct token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/Registration" element={<Registration token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole} setUserEmail={setUserEmail}/>} />
            <Route path="/SignIn" element={<SignIn token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole} setUserEmail={setUserEmail}/>} />
            <Route path="/UserProfile" element={<UserProfile token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/UserDetail" element={<UserDetail token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/UserManage" element={<UserManage token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/SingleOrder" element={<SingleOrder token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/UserCart" element={<UserCart token={token} setToken={setToken}  userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/UserCartOrder" element={<UserCartOrder token={token} setToken={setToken}  userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/UserOrderDetail" element={<UserOrderDetail token={token} setToken={setToken} />} />
            <Route path="/UserOrderHistory" element={<UserOrderHistory token={token} setToken={setToken} />} />
            <Route path="/ProductCategoryList" element={<ProductCategoryList token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
            <Route path="/ProductManage" element={<ProductManage token={token} setToken={setToken} userRole={userRole} setUserRole={setUserRole}/>} />
          </Routes>
          <Footer path="/Footer"/>
        </Router>
      </Provider>
    </>
  );
}

export default App;
