import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Results from './Results';
import PageNotFound from './PageNotFound';
import AppliedRoute from './AppliedRoute';

export default class Routes extends Component {
    render() {
        const {authData} = this.props;
        return (
            <Switch>
                <AppliedRoute path="/" exact component={Home} props={authData} />
                <AppliedRoute path="/login" exact component={Login} />
                <AppliedRoute path="/results" exact component={Results} props={authData} />
                <Route component={PageNotFound} />
            </Switch>
        );
    }
}
