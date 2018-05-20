import React, {PureComponent} from 'react';
import _ from 'lodash';
import {Auth} from "aws-amplify";
import FacebookLogin from 'react-facebook-login';

export default class Login extends PureComponent {
    state = {
        email: "",
        password: ""
    };


    async componentDidMount() {
        const user  = await Auth.currentAuthenticatedUser()
        if(user) {
           console.log(user);
        }
    }



    responseFacebook = (loggedInUser) => {
        if (_.has(loggedInUser, 'accessToken')) {
            const {accessToken: token, expiresIn} = loggedInUser;
            Auth.federatedSignIn('facebook', {token}, loggedInUser)
                .then(credentials => {
                    console.log('get aws credentials', credentials);
                }).catch(e => {
                console.log(e);
            });
        }
    }

    render() {
        return (
            <FacebookLogin
                appId="1025583144188581"
                fields="name,email,picture"
                version="3.0"
                callback={this.responseFacebook} />
        );
    }
}





