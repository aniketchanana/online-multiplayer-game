import React,{useState} from 'react';
import useInputState from '../hooks/useInputState';
import '../styles/Input.css';
import axios from 'axios';

function Signup(){
    const [email,changeEmail,resetEmail] = useInputState();
    const [name,changeName,resetName] = useInputState();
    const [password,changePassword,resetPassword] = useInputState();
    const [showWarning,setWarning] = useState(false);
    const [confirmPassword,changeConfirmPassword,resetConfirm] = useInputState();
    const [message,setMessage] = useState("");
    let validate = (str2)=>{
        if(password === confirmPassword)
        return false;
        else if(confirmPassword === "" && password !== confirmPassword)
        return false;
        return true;
    }
    const handelSubmit = (e)=>{
        e.preventDefault();
        const showWarning = validate();
        if(showWarning)
        {
            setWarning(showWarning);
            setMessage("Password does not match");
        }
        else
        {
            const data = {
                name,
                email,
                password
            }
            axios.post('/user',data)
            .then(function(response){
                console.log(response.data);
                setMessage("User Created successfully login and have fun");
                resetEmail();
                resetName();
                resetPassword();
                resetConfirm();
                setWarning(false);
            })
            .catch(function(error){
                console.log(error);
                setMessage("Error in creating user please check your email address");
                setWarning(true);
            })
        }
    }
    return (
        <form className="login__form" onSubmit={handelSubmit}>
            <div className="input__holder">
                <input className="input__field" name="name" type="text" value={name} onChange={changeName} placeholder="name" autoComplete="off" required/>
            </div>
            <div className="input__holder">
                <input className="input__field" name="email" type="text" value={email} onChange={changeEmail} placeholder="Email" autoComplete="off" required/>
            </div>
            <div className="input__holder">
                <input className="input__field" name="password" type="password" value={password} onChange={changePassword} placeholder="Password" autoComplete="off" required/>
            </div>
            <div className="input__holder">
                <input className="input__field" name="confirmpassword" type="password" value={confirmPassword} onChange={changeConfirmPassword} placeholder="Confirm Password" autoComplete="off" required/>    
                {showWarning?<p className="warning">{message}</p>:<p className="success">{message}</p>}
            </div>
            <div className="input__holder">
                <input type="submit" className="submit__btn" value="SignUp"/>
            </div>
        </form>
    )
}

export default Signup;
