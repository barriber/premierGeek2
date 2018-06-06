import React, {Component} from 'react';
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";

export default class Header extends Component {
    logOut = async () => {
        await Auth.signOut();
        this.props.onStateChange('signedOut')
    };

    render() {
        return (
            <div className="flex items-center justify-between f4-ns mb3 pa3 bb ">
                <div>
                    Premier Geek
                </div>
                <div>
                    Results
                </div>
                <div className="flex items-center">
                    <img className="mh3" src={this.props.authData.picture.data.url} />
                    <div onClick={this.logOut}>
                        Logout
                    </div>
                </div>

            </div>
        );
    }
}
