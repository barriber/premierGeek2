import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import PageNotFound from './PageNotFound';
import AppliedRoute from './AppliedRoute';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <AppliedRoute path="/" exact component={Home} />
                <AppliedRoute path="/login" exact component={Login} />
                <Route component={PageNotFound} />
            </Switch>
        );
    }
}

Routes.propTypes = {

};

export default Routes;