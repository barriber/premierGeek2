import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {withAuthenticator} from 'aws-amplify-react';
import './App.scss';
import Routes from './Routes';
import Header from './Header';
import Login from "./Login";

class App extends Component {
    state = {
        isAuthenticated: false,
        isAuthenticating: true
    }

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };
        return (
            <Router>
                <Fragment>
                    <Header childProps={childProps}/>

                    <div className="flex flex-grow-1">
                        <Routes childProps={childProps}/>
                    </div>

                </Fragment>
            </Router>

        );
    }
}

export default withAuthenticator(App, false, [
    <Login/>,
]);