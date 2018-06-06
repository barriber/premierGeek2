import React, {PureComponent} from 'react';
import {API} from "aws-amplify/lib/index";
import _ from 'lodash';

export default class Results extends PureComponent {
    state = {};

    async componentDidMount() {
        try {
            const results = await API.get("premiergeek-api-dev-fixtures", "results");

            this.setState({results});
        } catch (e) {
            console.log(e);
        }

        this.setState({isLoading: false});
    }

    analyzeResults = (results) => {
        const sortedResults = _.orderBy(results, 'score');
        sortedResults.map(result => {
            return (
                <div>
                {result.name}
            </div>
            )
        })
    }

    render() {
        const {results} = this.state;
        if(results) {
            this.analyzeResults(results);
            console.log(results);
        }
        return (
            <div>
                <div>
                    Results
                </div>
                <div></div>
            </div>
        );
    }
}
