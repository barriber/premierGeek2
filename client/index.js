import React from "react";
import Amplify from 'aws-amplify';
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import './config';
import App from './src/App'

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
    },
    Storage: {},
    API: {

    }
});
ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.getElementById("app"));