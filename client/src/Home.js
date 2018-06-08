import React, {PureComponent} from 'react';
import _ from 'lodash';
import {API} from "aws-amplify";
import {parse, format} from 'date-fns'

const teamNameClass = 'f2 mh3 width-11 tc';

class Home extends PureComponent {
    state = {};

    async componentDidMount() {
        try {
            const fixtures = await API.get("premiergeek-api-dev-fixtures", `fixtures/${this.props.email}`);
            const orderedGames = _.orderBy(fixtures, ['date'], ['asc']);
            this.setState({fixtures: _.take(orderedGames, 11)});
        } catch (e) {
            console.log(e);
        }

        this.setState({isLoading: false});
    }

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
        const {type, fixture} = e.target.dataset;
        const score = parseInt(e.target.value);
        await API.post("premiergeek-api-dev-fixtures", "bet", {
            body: {
                fixtureId: fixture,
                [type]: score,
                email,
            }
        });
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
                        <input type="number" className="w2 tc" data-type="homeTeamScore" data-fixture={id}
                               defaultValue={homeTeamBet} onKeyPress={this.onKeyPress}
                               onBlur={this.onBlur}/>
                        <div className="mh3 f3">VS</div>
                        <input type="number" className="w2 tc" data-type="awayTeamScore" data-fixture={id}
                               defaultValue={awayTeamBet} onKeyPress={this.onKeyPress}
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
