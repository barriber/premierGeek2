import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link  } from "react-router-dom";
import './Header.scss';

class Header extends Component {
    render() {
        return (
            <div className="premier-geek-header flex items-center justify-between ph3">
                <div>
                    <Link  to="/">Premier Geeks</Link >
                </div>
                <div>
                    <Link  to="/login" className="mr4">Signup</Link >
                    <Link  to="/login">Login</Link >
                </div>
            </div>
        );
    }
}


export default Header;