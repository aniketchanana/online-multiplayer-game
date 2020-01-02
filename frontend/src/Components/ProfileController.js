import React ,{Component} from "react";
import '../styles/ProfileController.css';
class ProfileController extends Component{
    render(){
        return(
            <div className="controller">
                <div className="profile__preview" title="Profile">
                    <span className="name__container">{this.props.name}</span>
                    <span><i className="fas fa-user"></i></span>
                </div>
                
                <p className="app__name">Gaming arena</p>
                
                <div className="logout__btn__holder" title="LogOut" onClick={this.props.logout}>
                    <span><i className="fas fa-sign-out-alt"></i></span>
                </div>
            </div>
        )
    }
}

export default ProfileController;