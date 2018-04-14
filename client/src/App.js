import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './App.scss';
import Routes from './Routes';
import Header from './Header';

class App extends PureComponent {
    render() {
        return (
            <div>
                <Header />
                <Routes />
            </div>
        );
    }
}

App.propTypes = {

};

export default App;