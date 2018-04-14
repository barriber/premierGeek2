import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './Header.scss';

class Header extends PureComponent {
    render() {
        return (
            <div className="premier-geek-header">
                <div>
                    <Link to="/">Premier Geek</Link>
                </div>
            </div>
        );
    }
}

Header.propTypes = {

};

export default Header;