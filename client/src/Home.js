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

     placeBet = async () => {
        const bet = await API.post("premiergeek-api-dev-fixtures", "bet", {
            body: {
                fixtureId: 165069,
                homeTeamScore: 1,
                awayTeamScore: 2,
            }
        });

        consoe.log(bet);
    }

    renderFixtures = () => {
        return this.state.fixtures.map(fixture => {
            return (
                <div className="flex items-center flex-row" key={fixture.id}>
                    <img src={fixture.homeLogo} alt={fixture.homeTeamName}/>
                    <div className="f-4">{fixture.homeTeamName}</div>
                    <input/>
                    -
                    <input/>
                    <div className="f-4">{fixture.awayTeamName}</div>
                    <img src={fixture.awayLogo} alt={fixture.awayTeamName}/>
                    <input type="button" onClick={this.placeBet}/>
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
