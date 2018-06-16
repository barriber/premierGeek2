import React, {PureComponent} from 'react';
import _ from 'lodash';
import {API, Auth, Cache} from "aws-amplify";
import {parse, format, isAfter, addHours} from 'date-fns'

const teamNameClass = 'f2 mh3 width-11 tc';

class Home extends PureComponent {
    state = {};

    async componentDidMount() {
        try {
            let fixtures = await Cache.getItem('fixtures');
            if(!fixtures || _.isEmpty(fixtures)) {
                const credentials = await Auth.currentUserCredentials();
                const identityId = credentials.data.IdentityId;
                fixtures = await API.get("premiergeek-api-dev-fixtures", `fixtures/${this.props.email || identityId}`);
                await this.cacheFixtures(fixtures);
            } else {
                const now = parse(new Date());
                const filteredFixtures = fixtures.filter(({ date }) => {
                    return isAfter(parse(date), now);
                });
                if (filteredFixtures.length !== fixtures.length) {
                    await this.cacheFixtures(filteredFixtures);
                    fixtures = filteredFixtures;
                }
            }
            const orderedGames = _.orderBy(fixtures, ['date'], ['asc']);
            this.setState({fixtures: orderedGames});
        } catch (e) {
            console.log(e);
        }

        this.setState({isLoading: false});
    }

    cacheFixtures = async (fixtures) => {
        const now = parse(new Date());
        const expire = addHours(now, 1);
        await Cache.setItem('fixtures', fixtures, { expires: expire.getTime() });
    };

    onKeyPress = (e) => {
        let key = e.keyCode || e.which;
        key = String.fromCharCode(key);
        const regex = /[0-9]|\./;
        if (!regex.test(key)) {
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
        }
    };

    onBlur = async (e) => {
        const {email} = this.props;
        const {fixtures} = this.state;
        const newFixtures = _.cloneDeep(fixtures);
        const {type, fixtureid} = e.target.dataset;
        const score = parseInt(e.target.value);
        if(!_.isNaN(score) && _.isNumber(score) && score >= 0 && score < 10){
            const newBet = await API.post("premiergeek-api-dev-fixtures", "bet", {
                body: {
                    fixtureId: fixtureid,
                    [type]: score,
                    email,
                }
            });

            const fixture = _.find(newFixtures, {id: fixtureid});
            fixture.homeTeamBet = newBet.homeTeamScore;
            fixture.awayTeamBet = newBet.awayTeamScore;
            await this.cacheFixtures(newFixtures);
            this.setState({fixtures: newFixtures});
        }
    };

    inputValue = (value) => {
        return _.isNull(value) ? '' : value;
    };

    renderFixtures = () => {
        return this.state.fixtures.map(({date, homeTeam, awayTeam, id, homeTeamBet, awayTeamBet}) => {
            if(!homeTeam){
                return null;

            }
            return (
                <div className="mv3" key={id}>
                    <div className="tc relative top-2">{format(parse(date),'MMMM Do H:mm')} </div>
                    <div className="flex items-center flex-row" >
                        <img src={homeTeam.logo} alt={homeTeam.name}/>
                        <div className={teamNameClass}>{homeTeam.name}</div>
                        <input type="number" className="w2 tc" data-type="homeTeamScore" data-fixtureid={id}
                               defaultValue={this.inputValue(homeTeamBet)} onKeyPress={this.onKeyPress}
                               onBlur={this.onBlur}/>
                        <div className="mh3 f3">VS</div>
                        <input type="number" className="w2 tc" data-type="awayTeamScore" data-fixtureid={id}
                               defaultValue={this.inputValue(awayTeamBet)} onKeyPress={this.onKeyPress}
                               onBlur={this.onBlur}/>
                        <div className={teamNameClass}>{awayTeam.name}</div>
                        <img src={awayTeam.logo} alt={awayTeam.name}/>
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

export default Home;
