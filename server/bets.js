import _ from 'lodash';
import {success} from './libs/response';
import {firebaseInit} from "./libs/firebase";

export async function placeBet(event, context, callback) {
    const body = JSON.parse(event.body);
    const bet = _.pick(body, ['homeTeamScore', 'awayTeamScore']);
    const userId = event.requestContext.identity.cognitoIdentityId;

    try {
        const db = firebaseInit(context);
        await db.collection(`users/${userId}/bets`)
            .doc(body.fixtureId.toString()).set(bet, {merge: true});
        callback(null, success());
    } catch (e) {
        console.log(e);
    }
}
//const userId = 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c'
// const body = {
//     homeTeamScore: 9 ,
//     awayTeamScore: 3,
//     fixtureId: 165069,
// }

