import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { API } from "aws-amplify";

class Home extends PureComponent {
    async componentDidMount() {
        // if (!this.props.isAuthenticated) {
        //     return;
        // }

        try {
            const notes = await this.notes();
            consoel.log(notes);
            this.setState({ notes });
        } catch (e) {
            console.log(e);
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    notes = () => {
        return API.get("premiergeek-api-dev-fixtures", "fixtures/fixtures");
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