import React from 'react';
import './styles/App.css';
import {Route,Switch} from 'react-router-dom';
import Authentication from './Components/Authentication';
import Games from './Components/Games';

function App() {
  return (
    <div className="main__app">
      <Switch>
        <Route exact path='/' component={(routeProps)=>{return <Authentication {...routeProps}/>  }}></Route>
        <Route exact path='/games/:userid' component={(routeProps)=>{return <Games {...routeProps}/>  }}></Route>
        {/* <Route exact path='/game/tic-tac-toe/:username/:userid' component={(routeProps)=> <Board {...routeProps}/> }></Route> */}
      </Switch>
    </div>
  );
}
export default App;
