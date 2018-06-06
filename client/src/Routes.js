import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Results from './Results';
import PageNotFound from './PageNotFound';
import AppliedRoute from './AppliedRoute';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <AppliedRoute path="/" exact component={Home} />
                <AppliedRoute path="/login" exact component={Login} />
                <AppliedRoute path="/results" exact component={Results} />
                <Route component={PageNotFound} />
            </Switch>
        );
    }
}

Routes.propTypes = {

};

export default Routes;
