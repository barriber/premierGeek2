import {success} from './libs/response';
import con from './libs/db';


export function placeBet(event, context, callback) {
    const {fixtureId, homeTeamScore, awayTeamScore} = JSON.parse(event.body);
    const userId = event.requestContext.identity.cognitoIdentityId;
    const sql = `REPLACE INTO bets (fixtureId, userId, time, homeTeamScore, awayTeamScore)
     Values (${fixtureId}, ${userId}, ${Date.now()}, ${homeTeamScore}, ${awayTeamScore})`;
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
