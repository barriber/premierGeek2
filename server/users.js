import _ from 'lodash';
import {success} from './libs/response';
import {firebaseInit} from './libs/firebase';

export async function setUser(event, context, callback) {
    const user = _.pick(JSON.parse(event.body), ['name', 'logo', 'email']);
    const userId = event.requestContext.identity.cognitoIdentityId;
    // const userId = '1234';
    // const user = {name: 'boris', log: 'png'}
    try {
        const db = firebaseInit(context);
        await db.collection("users").doc(userId).set(user);
    } catch (e) {
      console.log(e);
    }
    callback(null, success())
}
