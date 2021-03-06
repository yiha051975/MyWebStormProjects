import React, {Component} from 'react';
import logo from '../logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './landing-page';
import NewPost from './new-post';
import ErrorPage from './error-page';
import RouterRedirect from './router-redirect';
import {LANDING_PAGE, FORM} from '../utils/routes';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class App extends Component {
    getRoutes({location}) {
        return (
            <CSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                component="div"
                className="main-content-container"
            >
                <Switch key={location.key} location={location}>
                    <Route exact path={LANDING_PAGE} component={LandingPage}/>
                    <Route path={FORM} component={NewPost}/>
                    <Route component={ErrorPage}/>
                </Switch>
            </CSSTransitionGroup>
        );
    }

    render() {
        return (
            <Router basename="/react-redux-test">
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="react logo"/>
                        <h2>Welcome to React</h2>
                    </div>
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                    <Route render={this.getRoutes} />
                    <RouterRedirect/>
                </div>
            </Router>
        );
    }
}

export default App;
