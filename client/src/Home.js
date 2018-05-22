import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Amp, {API, Auth} from "aws-amplify";

class Home extends PureComponent {
    state = {};

    async componentDidMount() {
        try {
            // let session = await Auth.userAttributes();
            // console.log(Amp.FacebookOAuth.refreshFacebookToken());
            const fixtures = await API.get("premiergeek-api-dev-fixtures", "fixtures");
            const orderedGames = _.orderBy(fixtures, ['date'], ['asc']);
            this.setState({fixtures: _.take(orderedGames, 5)});
        } catch (e) {
            console.log(e);
        }

        this.setState({isLoading: false});
    }

     placeBet =  _.debounce(async (type, fixtureId, score) => {
       await API.post("premiergeek-api-dev-fixtures", "bet", {
            body: {
                fixtureId,
                [type]: score,
            }
        });
    }, 1000);

    onChange = (e) => {
        const {type, fixture} = e.target.dataset;
        const score  = parseInt(e.target.value);
        this.placeBet(type, fixture, score);
    }

    renderFixtures = () => {
        return this.state.fixtures.map(fixture => {
            return (
                <div className="flex items-center flex-row" key={fixture.id}>
                    <img src={fixture.homeLogo} alt={fixture.homeTeamName}/>
                    <div className="f-4">{fixture.homeTeamName}</div>
                    <input data-type="homeTeamScore" data-fixture={fixture.id} onChange={this.onChange} />
                    -
                    <input data-type="awayTeamScore" data-fixture={fixture.id} onChange={this.onChange} />
                    <div className="f-4">{fixture.awayTeamName}</div>
                    <img src={fixture.awayLogo} alt={fixture.awayTeamName}/>
                </div>
            )
        })
    }

    render() {
        if (!this.state.fixtures) {
            return null;
        }
        const x = this.renderFixtures();
        return (
            <div className="">
                {x}
            </div>
        );
    }
}

Home.propTypes = {};

export default Home;
