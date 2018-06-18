import  { success } from './libs/response';
import {firebaseInit} from "./libs/firebase";
import {getAllUsers, getFixtures, modifyResults} from './libs/utils';
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
    try {
        console.log('BEFORE GET FIXTURES');
        const fixtures = await getFixtures(db, '<');
        console.log('AFTER GET FIXTURES');
        const fixtureResults = fixtures.map(({homeTeamScore, awayTeamScore, id, homeTeam, awayTeam, date}) => {
            const gameStats = getGameStats(homeTeamScore, awayTeamScore);
            return {
                ...gameStats,
                homeTeamScore,
                awayTeamScore,
                homeTeam,
                awayTeam,
                id,
                date,
            }
        });


        console.log('GOT FIXTURES!!!')
        return _.keyBy(fixtureResults, 'id');
    } catch (e){
        console.log(e);
    }
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
    try {
        const usersArray = await getAllUsers(db);
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
        console.log('ALL USERS RETURN')
        return _.keyBy(usersData, 'userId');
    } catch (e) {
        console.log('ussers error!!!');
        console.log(e);
    }
};

export async function main(event, context, callback) {
    try {
    const db = firebaseInit(context);
    console.log('BEFORE DB Games');
        // const games = await analyzeFixtures(db);
        // console.log('AFTER DB Games');
        //
        // const users = await getUsersBets(db);
        // console.log('AFTER DB USERS');
        const [users, games] = await Promise.all([getUsersBets(db), analyzeFixtures(db), modifyResults(db)]);

    console.log('AFTER DB REQUEST');
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
                awayTeam: game.awayTeam,
                date: game.date,
            })
        });
        const scoreTypes = _.countBy(user.results, 'score');
        user.score = _.sumBy(user.results, 'score');
        user.exactBet = scoreTypes[30] || 0;
        user.goalDifference = scoreTypes[20] || 0;
        user.direction = scoreTypes[10] || 0;
    });

    const resultsArr = _.map(users, obj => (obj));
    callback(null, success(resultsArr));
    } catch (e) {
        console.log('ERRRROR');
        console.log(e);

    }
}
