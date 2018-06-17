import  { success } from './libs/response';
import {firebaseInit} from "./libs/firebase";
import {getFixtures, generateTeams, generateFixtures} from './libs/utils';
const getUserBets = async function(db, userId) {
    const usersBets = await db.collection('users').doc(userId)
        .collection('bets').get();
    const betsObj = {};
    usersBets.forEach(bet => {
        betsObj[bet.id] = bet.data();
    });

    return betsObj;
};

export async function main(event, context, callback) {
    const db = firebaseInit(context);
    // await generateTeams(db);
    // await generateFixtures(db);
    // const userId = 'us- east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c';
    const userId = event.pathParameters.id || event.requestContext.identity.cognitoIdentityId;
    console.log('=====' + userId);
    const [userBets, fixtures] = await Promise.all([
        getUserBets(db,userId),
        getFixtures(db, '>')
        ]);
    fixtures.forEach(fixture => {
        const userBet = userBets[fixture.id];
        if(userBet){
           fixture.homeTeamBet = userBet.homeTeamScore;
           fixture.awayTeamBet = userBet.awayTeamScore;
        }
    });

    callback(null, success(fixtures));
}
