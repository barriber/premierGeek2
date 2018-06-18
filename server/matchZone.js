import  { success } from './libs/response';
import {firebaseInit} from "./libs/firebase";
import _ from 'lodash';
import {getAllUsers, getFixturesData, getUsersBets} from "./libs/utils";

export async function main(event, context, callback) {
    const db = firebaseInit(context);
    const fixtures = await db.collection("fixtures")
        .where('status', '==' , 'IN_PLAY')
        .get();
    const currentMatches = await getFixturesData(fixtures);
    const usersArray = await getAllUsers(db);
    const x = await usersArray.map(async ({userId, ...other}) => {
        const userBets =  currentMatches.map( match => {
            return db.collection(`users/${userId}/bets`).doc(match.id);

        });

        if(userBets) {
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
            return { bet: userBet, ...other}
        })
        return {...match, userBets};
    });

    callback(null, success(result));
}
