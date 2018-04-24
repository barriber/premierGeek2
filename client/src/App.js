import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Auth } from "aws-amplify";
import './App.scss';
import Routes from './Routes';
import Header from './Header';

class App extends Component {
    state = {
        isAuthenticated: false,
        isAuthenticating: true
    }

    async componentDidMount() {
        try {
          if (await Auth.currentSession()) {
              console.log('xxx ')
            // this.userHasAuthenticated(true);
          }
        }
        catch(e) {
          if (e !== 'No current user') {
            alert(e);
          }
        }
      
        this.setState({ isAuthenticating: false });
      }
      
    render() {
        return (
            <Fragment>
                <Header />
                <div className="flex flex-grow-1">
                <Routes />
                </div>
            </Fragment>
        );
    }
}

App.propTypes = {

};

export default App;