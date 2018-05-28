import  { success } from './libs/response';
import {queryDB} from './libs/db';
import _ from 'lodash';

const gamesSql = "SELECT * From fixtures " +
    "WHERE fixtures.date > NOW()"; //todo change!!

const betsSql = "SELECT * From bets " +
    "WHERE bets.homeTeamScore IS NOT NULL AND bets.awayTeamScore IS NOT NULL";

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
export async function main(event, context, callback) {
    const [gamesResults, bets] = await Promise.all([queryDB(gamesSql), queryDB(betsSql)]);
    const gamesObj = analyzeFixtures(gamesResults);
    const analyzedBets = bets.map(({fixtureId, homeTeamScore, awayTeamScore, userId}) => {
        const betStats = getGameStats(homeTeamScore, awayTeamScore);
        let score = 0;
        const game = gamesObj[fixtureId];
        if (!game) {
            return {}
        }

        if (game.direction === betStats.direction) {
            score += 10;
            if (game.goalDifference === betStats.goalDifference) {
                score += 10;
                if (game.homeTeamScore === betStats.homeTeamScore) {
                    score += 10;
                }
            }
        }

        return {
            fixtureId,
            userId,
            score,
            betHomeScore: homeTeamScore,
            betAwayScore: awayTeamScore,
            homeTeamScore: game.homeTeamScore,
            awayTeamScore: game.awayTeamScore
        }
    });

    const result = _.groupBy(analyzedBets, 'userId');

    callback(null, success(result));
}
