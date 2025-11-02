import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import * as usersAPI from "../../utilities/users-api";
import * as ehrAPI from "../../utilities/ehr-api";
import loginImage from "../../assets/images/HomePage2.jpg";
import "./LoginPage.css";

export default function LoginPage({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const loginInitialState = { email: "", password: "" };
  const [loginData, setLoginData] = useState(loginInitialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (location.pathname === "/login") {
      navigate("/signup", { replace: true });
    }
    return () => {
      setShowPassword(false);
      setLoginData(loginInitialState);
    };
  }, [location.pathname]);

  const signupInitialState = { 
    patient_id: "", 
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "", 
    age: "", 
    gender: "", 
    location: "", 
    image: "" 
  };
  const [signupData, setSignupData] = useState(signupInitialState);
  const [errors, setErrors] = useState({
    patient_id: "", 
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "", 
    age: "", 
    gender: "", 
    location: "", 
    image: ""
  });
  let disabledSubmitBtn = Object.values(errors).every(val => val === "") && 
    Object.values(signupData).every(val => val !== "") ? false : true;

  function handleLoginChange(evt) {
    setLoginData({ ...loginData, [evt.target.name]: evt.target.value });
  }

  function handleSignupChange(evt) {
    const updatedFormData = { ...signupData, [evt.target.name]: evt.target.value };
    setSignupData(updatedFormData);
    checkErrors(evt);
  }

  function checkErrors({ target }) {
    const updateErrors = { ...errors };

    if (target.name === 'patient_id') {
      updateErrors.patient_id = target.value.length < 3 ? " must be unique" : "";
    }
    if (target.name === 'name') {
      updateErrors.name = target.value.length < 2 ? " must be at least two characters" : "";
    }
    if (target.name === 'password') {
      updateErrors.password = target.value.length < 3 ? "Your password must be at least three characters" : "";
    }
    if (target.name === 'confirmPassword') {
      updateErrors.confirmPassword = target.value !== signupData.password ? "Your passwords must match" : "";
    }
    if (target.name === 'email') {
      updateErrors.email = !target.value.includes("@") ? "Your email must include @" : "";
    }
    if (target.name === 'phone') {
      updateErrors.phone = target.value.length < 10 ? "Phone number must be at least 10 digits" : "";
    }
    if (target.name === 'age') {
      const age = parseInt(target.value);
      updateErrors.age = (isNaN(age) || age < 1 || age > 120) ? "Please enter a valid age." : "";
    }

    setErrors(updateErrors);
  }

  function handleNextClick(evt) {
    evt.preventDefault();
    if (loginData.email.trim()) {
      setShowPassword(true);
    }
  }

  async function handleLoginSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    
    if (isLoading) {
      return;
    }
    
    if (!showPassword) {
      handleNextClick(evt);
      return;
    }
    
    setIsLoading(true);
    try {
      const userData = await usersAPI.login(loginData);
      if (userData) {
        setUser(userData);
        setLoginData(loginInitialState);
        setShowPassword(false);
        navigate("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignupSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { confirmPassword, patient_id, age, ...signupDataWithoutConfirm } = signupData;
      const username = signupData.name.replace(/\s+/g, '').toLowerCase() || `user${patient_id}`;
      
      const ageValue = (age && typeof age === 'string' && age.trim() !== "") ? parseInt(age) : null;
      
      const signupPayload = {
        ...signupDataWithoutConfirm,
        username: username,
        patient_id_input: patient_id,
        age: ageValue
      };
      
      const newUser = await usersAPI.signup(signupPayload);
      
      try {
        const noteText = `Patient registered: ${signupData.name || 'N/A'}, Age: ${signupData.age || 'N/A'}, Gender: ${signupData.gender || 'N/A'}, Location: ${signupData.location || 'N/A'}`;
        await ehrAPI.createNote({ note_text: noteText });
      } catch (ehrError) {
      }
      
      setUser(newUser);
      setSignupData(signupInitialState);
      setErrors(signupInitialState);
      navigate("/");
    } catch (error) {
      setUser(null);
      let errorMessage = "Signup failed";
      
      if (error.error) {
        errorMessage = error.error;
      } else if (error.username) {
        errorMessage = `Username error: ${error.username}`;
      } else if (error.email) {
        errorMessage = `Email error: ${error.email}`;
      } else if (error.details) {
        errorMessage = JSON.stringify(error.details, null, 2);
      } else if (typeof error === 'object') {
        errorMessage = JSON.stringify(error, null, 2);
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="login-page-with-image">
      <div className="login-content-wrapper">
        <div className="login-form-section">
          <div className="auth-container signup-container-wide">
            {showLoginForm ? (
              <form onSubmit={handleLoginSubmit} className="form-container login">
                <h1>Login</h1>
                <div className="login-input-wrapper">
                  <input
                    value={loginData.email}
                    id="id_email"
                    required
                    placeholder="add email goldencare@hotmail.com"
                    maxLength="150"
                    name="email"
                    type="email"
                    onChange={handleLoginChange}
                    className="login-input"
                  />
                  {showPassword && (
                    <input
                      value={loginData.password}
                      id="id_password"
                      required
                      placeholder="Password"
                      name="password"
                      type="password"
                      onChange={handleLoginChange}
                      className="login-input"
                      autoFocus
                    />
                  )}
                </div>
                <button type="submit" className="btn login-btn" disabled={isLoading}>
                  {isLoading ? "Loading..." : (showPassword ? "Login" : "Next")}
                </button>
                <div className="signup-link-wrapper">
                  <p>Don't have an account?</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLoginForm(false);
                    }}
                    className="signup-link"
                  >
                    SignUp
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="form-container signup">
                <h1>SignUp</h1>
          <div className="signup-form-grid">
            <div className="signup-field">
              <label htmlFor="id_patient_id_signup">Patient ID *</label>
              <input 
                type="text" 
                id="id_patient_id_signup"
                value={signupData.patient_id} 
                name="patient_id" 
                placeholder="Add Patient ID 123" 
                minLength="3" 
                maxLength="50" 
                onChange={handleSignupChange} 
                required
              />
              {errors.patient_id && <p className="error-text">{errors.patient_id}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_name_signup">Name *</label>
              <input 
                type="text" 
                id="id_name_signup"
                value={signupData.name} 
                name="name" 
                placeholder="Full Name" 
                minLength="2" 
                maxLength="100" 
                onChange={handleSignupChange} 
                required
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_email">Email *</label>
              <input 
                type="email" 
                id="id_email"
                value={signupData.email} 
                name="email" 
                placeholder="add email goldencare@hotmail.com" 
                minLength="3" 
                maxLength="150" 
                onChange={handleSignupChange} 
                required
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_phone">Phone *</label>
              <input 
                type="tel" 
                id="id_phone"
                value={signupData.phone} 
                name="phone" 
                placeholder="Add phone number +966 555 555 555" 
                minLength="10" 
                maxLength="20" 
                onChange={handleSignupChange} 
                required
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_password1">Password *</label>
              <input 
                type="password" 
                id="id_password1"
                value={signupData.password} 
                name="password" 
                placeholder="add password 123" 
                minLength="3" 
                onChange={handleSignupChange} 
                required
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_confirm_password">Confirm Password *</label>
              <input 
                type="password" 
                id="id_confirm_password"
                value={signupData.confirmPassword} 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                onChange={handleSignupChange}
                required
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_age">Age *</label>
              <input 
                type="text" 
                id="id_age"
                value={signupData.age} 
                name="age" 
                placeholder="Age" 
                onChange={handleSignupChange} 
                required
              />
              {errors.age && <p className="error-text">{errors.age}</p>}
            </div>

            <div className="signup-field">
              <label htmlFor="id_gender">Gender *</label>
              <select 
                id="id_gender"
                value={signupData.gender} 
                name="gender" 
                onChange={handleSignupChange}
                required
                className="signup-select"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="error-text">{errors.gender}</p>}
            </div>

            <div className="signup-field full-width">
              <label htmlFor="id_location">Location</label>
              <input 
                type="text" 
                id="id_location"
                value={signupData.location} 
                name="location" 
                placeholder="Al-Ahsa, Saudi Arabia | Riyadh, Saudi Arabia" 
                maxLength="200" 
                onChange={handleSignupChange} 
              />
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            <div className="signup-field full-width">
              <label htmlFor="id_image">Image URL</label>
              <input 
                type="text" 
                id="id_image"
                value={signupData.image} 
                name="image" 
                maxLength="500" 
                onChange={handleSignupChange} 
              />
              {errors.image && <p className="error-text">{errors.image}</p>}
            </div>
          </div>
                <button type="submit" disabled={disabledSubmitBtn || isLoading} className="btn submit">
                  {isLoading ? "Submitting..." : "Submit!"}
                </button>
                <div className="signup-link-wrapper">
                  <p>Already have an account?</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLoginForm(true);
                    }}
                    className="signup-link"
                  >
                    Login
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="login-image-section">
          <div className="login-image-container">
            <img 
              src={loginImage} 
              alt="GoldenCare Healthcare" 
              className="login-side-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
