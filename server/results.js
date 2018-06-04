import  { success } from './libs/response';
import {queryDB} from './libs/db';
import _ from 'lodash';

const gamesSql = "SELECT * From fixtures " +
    "WHERE fixtures.date > NOW()";

const betsSql = "SELECT * From bets " +
    "WHERE bets.homeTeamScore IS NOT NULL AND bets.awayTeamScore IS NOT NULL";

const usersSql = "SELECT * From users ";

function  getGameStats(homeScore, awayScore) {
    let direction;
    let goalDifference = homeScore - awayScore;
    if (homeScore === awayScore) {
        direction = 0;
    } else {
        direction = homeScore > awayScore ? 1 : 2;
    }

    return {direction, goalDifference};
}

function analyzeFixtures(gamesResults) {
    const fixtureResults = gamesResults.map(({homeTeamScore, awayTeamScore, id}) => {
        const gameStats = getGameStats(homeTeamScore, awayTeamScore);
        return {
            ...gameStats,
            homeTeamScore,
            awayTeamScore,
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

export async function main(event, context, callback) {
    const [gamesResults, bets, users] = await Promise.all([queryDB(gamesSql), queryDB(betsSql), queryDB(usersSql)]);
    const gamesObj = analyzeFixtures(gamesResults);
    const analyzedBets = bets.map(({fixtureId, homeTeamScore, awayTeamScore, userId}) => {
        const betStats = getGameStats(homeTeamScore, awayTeamScore);
        const game = gamesObj[fixtureId];
        return {
            fixtureId,
            userId,
            score: calculateScore(game, betStats),
            betHomeScore: homeTeamScore,
            betAwayScore: awayTeamScore,
            homeTeamScore: game.homeTeamScore,
            awayTeamScore: game.awayTeamScore
        }
    });

    const userBets = _.groupBy(analyzedBets, 'userId');
    const result = users.map(user => {
        const bets = userBets[user.id];
        return {
            ...user,
            bets,
            totalScore: _.sumBy(bets, 'score'),
        }
    });
    callback(null, success(result));
}
