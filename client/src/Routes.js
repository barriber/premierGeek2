import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router-dom';
import Home from './Home';

class Routes extends PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/" exact component={Home} />
            </Switch>
        );
    }
}

Routes.propTypes = {

};

export default Routes;