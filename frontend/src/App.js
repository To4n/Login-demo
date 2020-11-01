import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import axios from 'axios';
//Pages
import login from './pages/login';
import signup from './pages/signup';

class App extends Component {
    render() {
        return(
           <Router>
            <div className="container">
              <Switch>
                <Route exact path="/" component={login} />
                <Route exact path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>
        );

    }
}

export default App;
