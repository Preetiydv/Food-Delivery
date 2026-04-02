import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'

const LoginPopup = ({setShowLogin}) => {
    const [currState,setCurrState]=useState("Login");
    const[showPassword,setShowPassword]=useState(false);
  return (
    <div className='login-popup' onClick={()=>setShowLogin(false)}>
        <form  className="login-popup-container" onClick={(e)=>e.stopPropagation()}>
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />

            </div>
            <div className="login-popup-inputs">
                {currState==="Login"?<></>:<input type="text" placeholder='Your Name' required />}
                
                <input type="email" placeholder='Your email' required />
                
                <div className="password-field">
                <input 
                type={showPassword ? "text" : "password"} 
                placeholder='Password' 
                required 
                />
                <span onClick={()=>setShowPassword(!showPassword)}>
                </span>
                </div>
            </div>
            <button>{currState==="Sign Up"?"Create Account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By continuing, i agree to the terms of use & privacy policy.</p>
            </div>
            {currState==="Login"
            ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span ></p>
            :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
            }
            
        </form>
      
    </div>
  )
}

export default LoginPopup
