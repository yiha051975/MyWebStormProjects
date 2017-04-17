import React, {Component} from 'react';
import logo from '../logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './landing-page';
import NewPost from './new-post';
import ErrorPage from './error-page';

class App extends Component {
    render() {
        return (
            <Router basename="/react-redux-test">
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h2>Welcome to React</h2>
                    </div>
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                    <Switch>
                        <Route exact path="/" component={LandingPage} />
                        <Route path="/form" component={NewPost} />
                        <Route component={ErrorPage} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
