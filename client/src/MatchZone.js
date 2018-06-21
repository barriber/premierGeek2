import React, {PureComponent} from 'react';
import {addHours, addMinutes, isAfter, parse} from "date-fns";

import {API, Auth, Cache} from "aws-amplify/lib/index";
import _ from 'lodash';

export default class MatchZone extends PureComponent {
    state = {
        games: [],
        paidOnly: true,
    };

    async componentDidMount() {
        const credentials = await Auth.currentUserCredentials();
        const userId = credentials.data.IdentityId;
        const isAdmin = userId === 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c';
        let games = await Cache.getItem('zone');
        if(!games) {
            games = await API.get('premiergeek-api-dev-fixtures', 'matchZone');
            const now = new Date();
            if(!isAdmin){
            games = _.filter(games, ({date}) => {
                return  isAfter(now, parse(date), );
            });
            }
            if(games && games.length > 0 && !isAdmin) {
                const now = parse(new Date());
                const cacheTime = addHours(now, 1);
                await Cache.setItem('zone', games, {expires: cacheTime.getTime()});
            }

        }
        this.setState({games, userIdentity: userId });
    }

    showToggle = () => {
        this.setState({paidOnly: !this.state.paidOnly});
    }

    renderResult({homeTeam, awayTeam, homeTeamScore, awayTeamScore}) {
        return (
            <div>
                <div className="flex items-center justify-center">
                    <img src={homeTeam.logo} alt={homeTeam.name}/>
                    <div className="mh4">{homeTeam.name}</div>
                    <div>{homeTeamScore}</div>
                    :
                    <div>{awayTeamScore}</div>
                    <div className="mh4">{awayTeam.name}</div>
                    <img src={awayTeam.logo} alt={homeTeam.name}/>
                </div>
                <div className="flex items-center justify-center items-center">
                    Paid Only
                    <input className="mh3" type="checkbox" checked={this.state.paidOnly} onClick={this.showToggle}/>
                </div>
            </div>
        )
    }

    userBets(usersBets) {
        const groupedResults = _.groupBy(usersBets, user => {
            return `${_.get(user, 'bet.homeTeamScore', 'N')}:${_.get(user,'bet.awayTeamScore', 'N')}`
        });
        const resultsGrpups =  _.map(groupedResults, (users, result) => {
            let filtered = users;
            if(this.state.paidOnly) {
                filtered = _.filter(users, {paid: true});
            }
            const usersGroup =  _.map(filtered, ({logo, name}) => {
                return (
                    <img key={name} className="mv2" src={logo} alt={name} title={name}/>
                )
            });

            if(_.isEmpty(usersGroup)) {
                return null;
            }
            usersGroup.push(<div>{result}</div>);
            return (<div key={result} className="flex flex-column mv3 mw3 ">{usersGroup}</div>);
        });


        return (<div className="flex items-end justify-around ">{resultsGrpups}</div>);
    }

    render() {
        const result = _.map(this.state.games, game => {
            return (
                <div key={game.id}>
                {this.renderResult(game)}

                {this.userBets(game.userBets)}
            </div>)
        });
        return (
            <div className="f2 flex-grow-1">
                {result}
            </div>
        );
    }
}
