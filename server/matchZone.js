import  { success } from './libs/response';
import {firebaseInit} from "./libs/firebase";
import _ from 'lodash';
import {getAllUsers, getFixturesData, getUsersBets} from "./libs/utils";

export async function main(event, context, callback) {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour > 10 && currentHour < 22) {
        const db = firebaseInit(context);
        let fixturesQuery = await db.collection("fixtures").where('status', '==', 'IN_PLAY').get();

        const userId = _.get(event, "requestContext.identity.cognitoIdentityId");
        if(userId !== 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c') {
            fixturesQuery = fixturesQuery.where('date', '<', new Date());
        }
        const fixtures = await fixturesQuery.get();
        const currentMatches = await getFixturesData(fixtures);
        if(currentMatches.length > 0) {
            const usersArray = await getAllUsers(db);
            const x = await usersArray.map(async ({userId, ...other}) => {
                const userBets = currentMatches.map(match => {
                    return db.collection(`users/${userId}/bets`).doc(match.id);

                });

                if (userBets) {
                    const bets = {}
                    const betsRefs = await db.getAll(...userBets);
                    betsRefs.forEach(tt => {
                        const d = tt.data();
                        bets[tt.id] = d;
                    });

                    return {...other, bets};
                } else {
                    return Promise.resolve()
                }
            });

            const u = await Promise.all(x);
            const result = currentMatches.map(match => {
                const userBets = u.map(({bets, ...other}) => {
                    const userBet = _.get(bets, match.id);
                    return {bet: userBet, ...other}
                })
                return {...match, userBets};
            });

            callback(null, success(result));
        }
    }
    callback(null, success());
}
