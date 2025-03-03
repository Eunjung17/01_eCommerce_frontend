import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {

    return(
    <>
        <div className="footer">
        <h6>Get email offers & the latest news from our eCommerce Market! &nbsp; <Link to="/Registration" ><button type="button" className="btn btn-primary">Register</button></Link>
        </h6>
        </div>
    </>
    );
}