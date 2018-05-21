import {success} from './libs/response';
import con from './libs/db';


export function placeBet(event, context, callback) {
    const {fixtureId, homeTeamScore, awayTeamScore} = JSON.parse(event.body);
    const userId = event.requestContext.identity.cognitoIdentityId;
    // const fixtureId = 165069;
    // const homeTeamScore = 2;
    // const awayTeamScore = 0;
    // const user = 'Boirs';
    const sql = 'INSERT INTO bets (fixtureId, homeTeamScore, awayTeamScore, userId) ' +
        `VALUES (${fixtureId}, ${homeTeamScore}, ${awayTeamScore}, '${userId}')`;
    con.query(sql, function(err, result) {
        console.log('--------');
        if (err) {
            console.log('*****************');
            throw err;
        };

        con.end();
        callback(null, success())
    })

}
