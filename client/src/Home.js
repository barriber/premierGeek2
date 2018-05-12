import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { API } from "aws-amplify";

class Home extends PureComponent {
    async componentDidMount() {
         

        try {
            const x = await API.get("premiergeek-api-dev-fixtures", "fixtures");

            this.setState({ x });
        } catch (e) {
            console.log(e);
        }

        this.setState({ isLoading: false });
    }

    render() {
        return (
            <div>
                UNITED
            </div>
        );
    }
}

Home.propTypes = {

};

export default Home;