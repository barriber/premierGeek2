import _ from 'lodash';
import {success} from './libs/response';
import con from './libs/db';


export function placeBet(event, context, callback) {
    const obj = _.pick(JSON.parse(event.body), ['fixtureId', 'homeTeamScore', 'awayTeamScore']);
    obj.userId = event.requestContext.identity.cognitoIdentityId;
    con.query('REPLACE INTO bets SET ?', obj, function(err) {
        console.log('--------');
        if (err) {
            console.log('*****************');
            throw err;
        }

        con.end();
        callback(null, success())
    });
}


// const obj = {homeTeamScore: 2, awayTeamScore: 5,
//     fixtureId: 165069,
//     userId: 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c'};
