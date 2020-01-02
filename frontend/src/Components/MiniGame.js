import React from "react";
import '../styles/MiniGame.css';
function MiniGame(props){
    // let to = props.name.replaceAll("-","")
    // to = to.replaceAll(" ","");
    return (
        <div className="col-lg-6 col-sm-12 col-xs-12">
            <center>
                <div className="gameCard">
                    <img src={props.image} alt="game" className="game__image"/>
                        <p className="gameName">{props.name}</p>
                        <button className="play__btn"><a href={`/tictactoe?username=${props.playername}&userid=${props.userid}`}>Play now</a></button>
                </div>
            </center>
        </div>
    )
}

export default MiniGame;