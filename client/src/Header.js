import React, {Component} from 'react';
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";

const linkClass = "white dim no-underline mh4";
export default class Header extends Component {
    logOut = async () => {
        await Auth.signOut();
        this.props.onStateChange('signedOut')
    };

   resultsLink = () => {
       const now = new Date();
       const date = new Date('2018-06-14T12:00:00Z')
       if(now > date) {
           return (
               <Link to="/results" className={linkClass}>
                   Results
               </Link>
           )
       }

       return null;
   }

    render() {
        return (
            <header className="flex items-center justify-between bg-black-90 f4-ns mb3 pa3 fixed w-100">
                <div>
                    <Link to="/" className={linkClass}>
                        Premier Geek
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
