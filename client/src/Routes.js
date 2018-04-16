import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import PageNotFound from './PageNotFound';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route component={PageNotFound} />
            </Switch>
        );
    }
}

Routes.propTypes = {

};

export default Routes;