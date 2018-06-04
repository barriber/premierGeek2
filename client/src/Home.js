import React, {PureComponent} from 'react';
import _ from 'lodash';
import {API} from "aws-amplify";
import {parse, format} from 'date-fns'

const teamNameClass = 'f2 mh3 width-11 tc';

class Home extends PureComponent {
    state = {};

    async componentDidMount() {
        try {
            const fixtures = await API.get("premiergeek-api-dev-fixtures", "fixtures");
            const orderedGames = _.orderBy(fixtures, ['date'], ['asc']);
            // this.setState({fixtures: _.take(orderedGames, 5)});
            this.setState({fixtures:orderedGames});
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
        return this.state.fixtures.map(({date, homeTeam, awayTeam, id}) => {
            if(!homeTeam){
                return null;

            }
            return (
                <div className="mv3" key={id}>
                    <div className="tc relative top-2">{format(parse(date),'MMMM Do H:mm')} </div>
                    <div className="flex items-center flex-row" >
                        <img src={homeTeam.logo} alt={homeTeam.name}/>
                        <div className={teamNameClass}>{homeTeam.name}</div>
                        <input className="w2 tc" data-type="homeTeamScore" data-fixture={id}
                               defaultValue={0}
                               onChange={this.onChange}/>
                        <div className="mh3 f3">VS</div>
                        <input className="w2 tc" data-type="awayTeamScore" data-fixture={id}
                               defaultValue={0} onChange={this.onChange}/>
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

Home.propTypes = {};

export default Home;
