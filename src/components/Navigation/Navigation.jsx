import { Link } from 'react-router-dom';
import './Navigation.css';
import { useNavigate } from "react-router-dom";

export default function Navigation({token, setToken, userRole, setUserRole, userEmail}) {

    const navigate = useNavigate();

    const logOut = () => {
        setToken(null);
        
        setTimeout(function(){
            navigate("/");
        },1000);
    }

    return(
    <>
    <div className="top">
    <div className="header">
        <h1>E-Commerce Market</h1>
        <p>Free shipping on orders over $50.</p>
        </div>

        <div className="topnav">

        {token && userEmail &&
                <Link to="UserProfile">[ Email: {userEmail} ]</Link>
        }

        <Link to="/">Home</Link>
        <Link to="/AboutUs">About us</Link>

        { !token ? 
        (<>
            <Link to="/SignIn" style={{float:'right'}}>Sign in  </Link>
            <Link to="/Registration" style={{float:'right'}}>Register</Link>
        </>) : 
        (<>
            {userRole && userRole === '1' && (
            <>
                <Link to="/UserOrderHistory" style={{float:'right'}}>Order History</Link>
                <Link to="/UserProfile" style={{float:'right'}}>User Profile</Link>
                <Link to="/UserCart" style={{float:'right'}}>Cart</Link>
                <Link to="/" style={{float:'right'}} onClick={logOut}>Log Out</Link>
            </>
            )}
            {userRole &&  userRole === '2' && (
            <>
                <Link to="/" style={{float:'right'}} onClick={logOut}>Log Out</Link>
                <Link to="/UserProfile" style={{float:'right'}}>User Profile</Link>
                <Link to="/ProductManage" style={{float:'right'}}>Product Management</Link>
            </>
            )}
            {userRole &&  userRole === '3' && (
            <>
                <Link to="/" style={{float:'right'}} onClick={logOut}>Log Out</Link>
                <Link to="/UserProfile" style={{float:'right'}}>User Profile</Link>
                <Link to="/UserManage" style={{float:'right'}}>User Management</Link>
                {/* <Link to="/ProductManage" style={{float:'right'}}>Product Management</Link> */}
            </>
            )}
        </>)
        }
        </div>
    </div>
    </>
    );
}