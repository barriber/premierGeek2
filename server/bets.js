import _ from 'lodash';
import {success, failure} from './libs/response';
import {firebaseInit} from "./libs/firebase";

export async function placeBet(event, context, callback) {
    const body = JSON.parse(event.body);
    const bet = _.pick(body, ['homeTeamScore', 'awayTeamScore']);
    const fixtureId = body.fixtureId.toString();
    const userId = body.email || event.requestContext.identity.cognitoIdentityId;
    try {
        const db = firebaseInit(context);
        const fixture = await db.collection('fixtures').doc(fixtureId).get();
        const {date: fixtureDate} = fixture.data();
        if( fixtureDate > new Date()) {
            await db.collection(`users/${userId}/bets`)
                .doc(fixtureId)
                .set(bet, {merge: true});
            callback(null, success());
        } else {
            callback(null, failure("Invalid date time"));
        }
    } catch (e) {
        console.log(e);
    }
}

// const userId = 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c'
// const body = {
//     homeTeamScore: 9,
//     awayTeamScore: 3,
//     fixtureId: 165069,
// }
