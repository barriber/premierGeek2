import  { success } from './libs/response';
import {firebaseInit} from "./libs/firebase";
import {getFixtures} from './libs/utils';
import _ from 'lodash';

function  getGameStats(homeTeamScore, awayTeamScore) {
    let direction;
    let goalDifference = homeTeamScore - awayTeamScore;
    if (homeTeamScore === awayTeamScore) {
        direction = 0;
    } else {
        direction = homeTeamScore > awayTeamScore ? 1 : 2;
    }

    return {direction, goalDifference, homeTeamScore, awayTeamScore};
}

async function analyzeFixtures(db) {
    const fixtures = await getFixtures(db, '<');
    const fixtureResults = fixtures.map(({homeTeamScore, awayTeamScore, id, homeTeam, awayTeam}) => {
        const gameStats = getGameStats(homeTeamScore, awayTeamScore);
        return {
            ...gameStats,
            homeTeamScore,
            awayTeamScore,
            homeTeam,
            awayTeam,
            id,
        }
    });

    return _.keyBy(fixtureResults, 'id');
}

function calculateScore(game, betStats) {
    let score = 0;
    if (game.direction === betStats.direction) {
        score += 10;
        if (game.goalDifference === betStats.goalDifference) {
            score += 10;
            if (game.homeTeamScore === betStats.homeTeamScore) {
                score += 10;
            }
        }
    }

    return score;
}

const getUsersBets = async (db) => {
    const users = await db.collection('users').get();
    const usersArray = [];
    users.forEach(user => {
        usersArray.push({userId: user.id, ...user.data()});
    });
    const x = usersArray.map(async ({userId, ...other}) => {
        const bets = await db.collection(`users/${userId}/bets`).get();
        const userBets = {};
        bets.forEach(bet => {
            const userBet = bet.data();
            userBets[bet.id] = userBet

        });
        return {userId, bets: userBets, ...other};
    })

    const usersData = await Promise.all(x);
    return _.keyBy(usersData, 'userId');
};

export async function main(event, context, callback) {
    const db = firebaseInit(context);
    const [users, games] = await Promise.all([getUsersBets(db), analyzeFixtures(db)]);
    _.forEach(users, user => {
        user.results = [];
        _.forEach(user.bets, (bet, fixtureId) => {
            const {homeTeamScore, awayTeamScore} = bet;
            const betStats = getGameStats(homeTeamScore, awayTeamScore);
            const game = games[fixtureId];
            if(!game) {
                return;
            }
            user.results.push({
                fixtureId,
                score: calculateScore(game, betStats),
                betHomeScore: homeTeamScore,
                betAwayScore: awayTeamScore,
                homeTeamScore: game.homeTeamScore,
                awayTeamScore: game.awayTeamScore,
                homeTeam: game.homeTeam,
                awayteam: game.awayTeam,
            })
        });
        user.score = _.sumBy(user.results, 'score');
    });

    const resultsArr = _.map(users, obj => (obj));
    callback(null, success(resultsArr));
}
