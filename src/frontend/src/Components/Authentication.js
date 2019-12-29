import React, { Component } from 'react';
import '../styles/Authentication.css'
import Login from './Login'
import SignUp from './SignUp'
import axios from "axios";
class Authentication extends Component{
    constructor(props)
    {
        super(props);

        this.state = {
            showLoginForm:true,
        }
        this.toggleToTrue = this.toggleToTrue.bind(this)
        this.toggleToFalse = this.toggleToFalse.bind(this)
        this.login = this.login.bind(this);
    }
    componentDidMount(){
        // axios.get(`/checkauth`)
        // .then(function(response){
        //     this.login(response.data.userid);
        // })
        // .catch(function(error){
        //     window.location.href = "/";
        // })
        const userId = window.sessionStorage.getItem("id");
        if(userId !== null)
        this.login(userId);
        else
        this.props.history.push("/");
    }

    login(userid){
        window.sessionStorage.setItem("id",userid)
        this.props.history.push(`/games/${userid}`)
    }

    toggleToTrue(){
        this.setState({
            showLoginForm:true
        })
    }
    toggleToFalse(){
        this.setState({
            showLoginForm:false
        })
    }
    render(){
        const {showLoginForm} = this.state;
        return(
            <div className="Authentication__page">
                <div className="Authentication__form__holder">

                    <div className="select__menu">
                        <div className={showLoginForm?"select__btn active":"select__btn"} onClick={this.toggleToTrue}>LogIn</div>
                        <div className={!showLoginForm?"select__btn active":"select__btn"} onClick={this.toggleToFalse}>SignUp</div>
                    </div>

                    <div className="form__holder">
                        {showLoginForm?<Login login={this.login}/>:<SignUp/>}
                    </div>

                </div>
            </div>
        )
    }
}

export default Authentication;

