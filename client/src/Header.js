import React, {Component} from 'react';
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";

const linkClass = "white dim no-underline mh4 pointer";
export default class Header extends Component {
    logOut = async () => {
        await Auth.signOut();
        this.props.onStateChange('signedOut')
    };

    render() {
        return (
            <header className="flex items-center justify-between bg-black-90 f4-ns mb3 pa3 fixed w-100">
                <div>
                    <Link to="/" className={linkClass}>
                        Premier Geek
                    </Link>
                    <Link to="/results" className={linkClass}>
                        Results
                    </Link>
                    <Link to="/zone" className={linkClass}>
                        Match Zone
                    </Link>

                </div>
                <div className="flex items-center">
                    <img className="mh3" src={this.props.authData.picture.data.url}/>
                    <div onClick={this.logOut} className={linkClass}>
                        Logout
                    </div>
                </div>

            </header>
        );
    }
}
