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
        const sortedResults = _.orderBy(results, 'score', ['desc']);
        return sortedResults.map((result, index) => {
            return (
                <div className="flex justify-between hover-bg-light-blue mv2 items-center" key={result.userId}>
                    <div className="flex items-center">
                        <div className="mh3 b">{index + 1}</div>
                        <img className="" src={result.logo} />
                        <div className="mh3">
                            {result.name}
                        </div>
                    </div>
                    <div className="mh3">
                        {result.score}
                    </div>
                </div>
            )
        })
    }

    render() {
        const {results} = this.state;

        return (
            <div className="w-50 center flex flex-column f3">
                <div className="self-end">
                    Score
                </div>
                    {this.analyzeResults(results)}
            </div>
        );
    }
}
