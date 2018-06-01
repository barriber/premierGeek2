import React, {PureComponent} from 'react';
import _ from 'lodash';
import {API} from "aws-amplify";
import {parse, format} from 'date-fns'

const teamNameClass = 'f2 mh3 w4 tc';

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

    placeBet = _.debounce(async (type, fixtureId, score) => {
        await API.post("premiergeek-api-dev-fixtures", "bet", {
            body: {
                fixtureId,
                [type]: score,
            }
        });
    }, 500);

    onChange = (e) => {
        const {type, fixture} = e.target.dataset;
        const score = parseInt(e.target.value);
        this.placeBet(type, fixture, score);
    };

    renderFixtures = () => {
        return this.state.fixtures.map(fixture => {
            const x = parse(fixture.date)
            return (
                <div className="mv3" key={fixture.id}>
                    <div className="tc relative top-2">{format(x,'MMMM Do H:mm')} </div>
                    <div className="flex items-center flex-row" >
                        <img src={fixture.homeLogo} alt={fixture.homeTeamName}/>
                        <div className={teamNameClass}>{fixture.homeTeamName}</div>
                        <input className="w2 tc" data-type="homeTeamScore" data-fixture={fixture.id}
                               defaultValue={fixture.betHomeTeam}
                               onChange={this.onChange}/>
                        <div className="mh3 f3">VS</div>
                        <input className="w2 tc" data-type="awayTeamScore" data-fixture={fixture.id}
                               defaultValue={fixture.betAwayTeam} onChange={this.onChange}/>
                        <div className={teamNameClass}>{fixture.awayTeamName}</div>
                        <img src={fixture.awayLogo} alt={fixture.awayTeamName}/>
                    </div>
                </div>
            )
        })
    };

    render() {
        if (!this.state.fixtures) {
            return null;
        }
        return (
            <div className="center ">
                {this.renderFixtures()}
            </div>
        );
    }
}

Home.propTypes = {};

export default Home;
