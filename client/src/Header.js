import React, {Component} from 'react';
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import {AppBar, Toolbar, IconButton, Typography, Button} from 'material-ui';

export default class Header extends Component {
    logOut = async () => {
        await Auth.signOut();
        window.location.reload();
    };

    static contextTypes = {
        router: PropTypes.object
    }

    render() {
        return (
            <AppBar position="static">
                <Toolbar className="flex justify-between">
                    <Typography variant="title" color="inherit" component={Link} to="/">
                        Premier Geek
                    </Typography>
                    <div onClick={this.logOut}>
                        Logout
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}
