import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link  } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Menu, { MenuItem } from 'material-ui/Menu';
import { AppBar, Toolbar, IconButton, Typography, Button } from 'material-ui';

export default class Header extends Component {
    render() {
        return (
            <AppBar position="static">
                <Toolbar className="flex justify-between">
                    <Typography variant="title" color="inherit"  component={Link} to="/">
                        Premier Geek
                    </Typography>
                    <Button component={Link} to="/login" color="inherit">
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        );
    }
}
