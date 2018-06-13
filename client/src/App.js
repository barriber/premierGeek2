import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {withAuthenticator} from 'aws-amplify-react';
import './App.scss';
import Routes from './Routes';
import Header from './Header';
import Login from "./Login";

class App extends Component {
    render() {
       const {onStateChange, authData} = this.props;
        return (
            <Router>
                <Fragment>
                    <Header onStateChange={onStateChange} authData={authData}/>

                    <div className="flex flex-grow-1 pt6">
                        <Routes authData={authData}/>
                    </div>

                </Fragment>
            </Router>

        );
    }
}

export default withAuthenticator(App, false, [
    <Login/>,
]);
