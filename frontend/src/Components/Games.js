import React,{useState,useEffect} from "react";
import axios from "axios";
import '../styles/Game.css';
import ProfileController from './ProfileController';
import MiniGame from './MiniGame';
import list from '../GamesComponent/list';

function Games(props){
    const [name,changeName] = useState("");
    useEffect(()=>{
        axios.get(`/user/${props.match.params.userid}`)
        .then(function(response){
            changeName(response.data.name);
        })
        .catch(function(error){
            props.history.push('/');
        })
    })

    function logout(){
        axios.post('/logout')
        .then(function(response){
            window.sessionStorage.clear();
            changeName("");
            props.history.push('/');
        })
        .catch(function(err){
            console.log(err);
        })
    }
    if(name==="")
    {
        return (
            <div className="loader__holder">
                <h1 className="loader">Loading...</h1>
            </div>
        )
    }
    
    return(
        <div className="game__area">

            <div>
                <ProfileController name={name} logout={logout}></ProfileController>
            </div>
            <div className="container">
                <div className="games row">
                    <MiniGame name={list[0].game} image={list[0].image} userid={props.match.params.userid} playername={name}></MiniGame>
                </div>
            </div>
        </div>
    )
}

export default Games;


