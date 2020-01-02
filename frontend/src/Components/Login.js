import React,{useState} from 'react';
import useInputState from '../hooks/useInputState';
import '../styles/Input.css';
import axios from "axios";
function Login(props){
    const [email,changeEmail,resetEmail] = useInputState();
    const [password,changePassword,resetPassword] = useInputState();
    const [showWarning,toggleShowWarning] = useState(false);

    const login = (e)=>{
        e.preventDefault();
        const data = {
            email,
            password
        }
        axios.post('/user/login',data)
        .then(function(response){
            const {userId} = response.data;
            props.login(userId);
        })
        .catch(function(error){
            console.log(error);
            resetEmail();
            resetPassword();
            toggleShowWarning(true);
        })
    } 
    return (
        <form className="login__form" onSubmit={login}>
            <div className="input__holder">
                <input className="input__field" name="email" type="text" value={email} onChange={changeEmail} placeholder="Email" autoComplete="off"/>
            </div>
            <div className="input__holder">
                <input className="input__field" name="password" type="password" value={password} onChange={changePassword} placeholder="Password" autoComplete="off"/>
                {showWarning?<p className="warning">Unable to Login please check your credentials</p>:<p></p>}
            </div>
            <div className="input__holder">
                <input type="submit" className="submit__btn" value="LogIn"/>
            </div>
            
        </form>
    )
}

export default Login;
