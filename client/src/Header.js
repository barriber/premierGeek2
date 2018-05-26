import React, {Component} from 'react';
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";

export default class Header extends Component {
    logOut = async () => {
        await Auth.signOut();
        window.location.reload();
    };

    render() {
        return (
            <div className="flex items-center justify-between f4-ns mb5 pa3 bb ">
                <div>
                    Premier Geek
                </div>
                <div>
                    <div onClick={this.logOut}>
                        Logout
                    </div>
                </div>

            </div>
        );
    }
}
