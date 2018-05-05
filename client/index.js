// import "babel-core/register";
import "babel-polyfill";
import React from "react";
import Amplify from 'aws-amplify';
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import 'tachyons';
import awsConfig from './awsConfig';
import App from './src/App'
import './index.scss';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: awsConfig.cognito.REGION,
        userPoolId: awsConfig.cognito.USER_POOL_ID,
        identityPoolId: awsConfig.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "premiergeek-api-dev-fixtures",
                endpoint: awsConfig.apiGateway.URL,
                region: awsConfig.apiGateway.REGION
            },
        ]
    }
});

ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.getElementById("app"));