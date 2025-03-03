    import { Link, useNavigate } from "react-router-dom";
    import { useState, useEffect } from "react";
    import './Registration.css';
    import { useRegisterUserMutation } from '../../redux/slices/userSlice'

    export default function Registration({token, setToken, userRole, setUserRole, setUserEmail}) {

        const navigate = useNavigate();
        const [alert, setAlert] = useState("");
        const [fadeOut, setFadeOut] = useState(false);

        const [registerUserApi, {isLoading, error}] = useRegisterUserMutation();

        const [formData, setFormData] = useState({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            address: '',
            phone: '',
            userRoleId: '',
            taxId: '',
        });

        const handleChange = (e) => {
            if(e.target.id ==='individual') setFormData({...formData, [e.target.name]: "1"});
            else if(e.target.id ==='business') setFormData({...formData, [e.target.name]: "2"});
            else setFormData({...formData, [e.target.name]: e.target.value});
        }

        const handleClose = () => {

            setFadeOut(true);
            setTimeout(() => {
                setAlert("");
                setFadeOut(false);
            }, 600);
        }

        const userRegistration = async(e) => {
            e.preventDefault();

            try {
                if(formData.email && formData.firstName && formData.lastName && formData.password && formData.confirmPassword && formData.address && formData.phone && formData.userRoleId){
                    if(formData.userRoleId === "2" && formData.taxId === "") {
                        setAlert("Business users need a tax ID.");
                        return;
                    }else if(formData.password !== formData.confirmPassword) {
                        setAlert("Password and confirm password must be same.");
                        return;
                    }else{  //possible condition to register                         
                        const response = await registerUserApi(formData).unwrap(); 

                        if(response.message){ //if same id exists,  message: "Please try again later." from backend
                            setAlert(response.message);
                            return;
                        }else if(response.token){ //if user gets token after successful registration.
                            setToken(response.token);
                            setUserRole(response?.response.userRoleId.toString());
                            setUserEmail(response?.userInformation?.email?.toString());
                            navigate("/");
                        }
                    }

                }else {
                    setAlert("All fields must be filled in.");
                    return;
                }
            } catch (error) {
                console.log(error);
                if(error && error.data && error.data.message) setAlert(error.data.message);
                else setAlert("An error occurred, please try again.");
            }
        }

        {isLoading && <output>Uploading information...</output>}
        {error && <output>{error.message}</output>}

        return(
        <>
            <div className="registration-form-whole">
                <div className="registration-form">
                    <div className="form-header">
                        <h2>Create Your Account</h2>
                        <p>Sign up to get started!</p>
                    </div>
                {alert &&
                    <div id="notification" className={`alert warning ${fadeOut ? 'fade-out' : ''}`} onClick={handleClose}>
                        <span className="closebtn">&times;</span>  
                        <strong>Warning!</strong> {alert}
                    </div>
                }
                    <form onSubmit={userRegistration}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} autoComplete="current-email" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <div className="name">
                                <input type="firstName" className="form-control" id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}  required/>
                                <input type="lastName" className="form-control" id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} autoComplete="current-id" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} autoComplete="current-password" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="address" className="form-control" id="address" name="address" placeholder="Enter your address" value={formData.address} onChange={handleChange} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="phone" className="form-control" id="phone" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required/>
                        </div>
                        <div className="user-type">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="userRoleId" id="individual" onChange={handleChange} />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Individual
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="userRoleId" id="business" onChange={handleChange}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    Business Owner
                                </label>
                            </div>
                        </div>
                        {formData.userRoleId === "2" && 
                        <>
                            <div className="mb-3">
                                <label htmlFor="taxId" className="form-label">Tax ID</label>
                                <input type="taxId" className="form-control" id="taxId" name="taxId" placeholder="Enter your Tax ID" value={formData.taxId} onChange={handleChange} required/>
                            </div>
                        </>
                        }

                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="terms" required/>
                            <label className="form-check-label" htmlFor="terms">I agree to the <a href="#" className="text-primary">terms and conditions</a></label>
                        </div>
                        <button type="submit" className="btn btn-custom w-100">Register</button>
                    </form>
                    <div className="text-muted">
                        Already have an account? <Link to="/SignIn">Sign in  </Link>
                    </div>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                </div>
            </div>
        </>
        );
    }