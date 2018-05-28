import _ from 'lodash';
import {success} from './libs/response';
import {queryDB} from './libs/db';

const query = 'INSERT INTO bets SET ? ' +
    'ON DUPLICATE KEY UPDATE ?';

export async function placeBet(event, context, callback) {
    const obj = _.pick(JSON.parse(event.body), ['fixtureId', 'homeTeamScore', 'awayTeamScore']);
    obj.userId = event.requestContext.identity.cognitoIdentityId;

    await queryDB(query, [obj, obj]);
    callback(null, success());
}

// const obj = {
//     homeTeamScore: 0,
//     awayTeamScore: 8,
//     fixtureId: 165069,
//     userId: 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c'};


