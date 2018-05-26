import React, {PureComponent} from 'react';
import _ from 'lodash';
import {Auth, API} from "aws-amplify";
import FacebookLogin from 'react-facebook-login';

export default class Login extends PureComponent {
    state = {
        email: "",
        password: ""
    };


    async componentDidMount() {
        const user = await Auth.currentAuthenticatedUser()
        if (user) {
            console.log(user);
        }
    }


    responseFacebook = async (loggedInUser) => {
        if (_.has(loggedInUser, 'accessToken')) {
            const {accessToken: token, expiresIn, email, name, picture} = loggedInUser;
            const credentials = await Auth.federatedSignIn('facebook', {token}, loggedInUser);
            await API.post("premiergeek-api-dev-fixtures", "users", {
                body: {
                    name,
                    email,
                    logo: picture.data.url
                }
            });
        }
    };

    render() {
        return (
            <div className="login-page flex flex-auto items-center justify-center flex-column">
                <h1>Welcome to PremierGeek</h1>
                <FacebookLogin
                    appId="1025583144188581"
                    fields="name,email,picture"
                    version="3.0"
                    callback={this.responseFacebook}/>
            </div>
        );
    }
}





