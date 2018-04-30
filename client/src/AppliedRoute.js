import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props => <C {...props} {...cProps} />} />;