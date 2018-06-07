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
        return sortedResults.map((result, index) => {
            return (
                <div className="flex justify-between items-center hover-bg-light-blue" key={result.userId}>
                    <div className="flex items-center">
                        <div className="f3 mh3 b">{index + 1}</div>
                        <img className="" src={result.logo} />
                        <div className="f3 mh3">
                            {result.name}
                        </div>
                    </div>
                    <div className="f3 mh3">
                        {result.score}
                    </div>
                </div>
            )
        })
    }

    render() {
        const {results} = this.state;

        return (
            <div className="flex-grow-1">
                <div>
                    Results
                </div>
                <div className="w-50 center">
                    {this.analyzeResults(results)}
                </div>
            </div>
        );
    }
}
