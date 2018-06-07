import _ from 'lodash';
import {success} from './libs/response';
import {firebaseInit} from './libs/firebase';

export async function setUser(event, context, callback) {
    const user = _.pick(JSON.parse(event.body), ['name', 'logo', 'email']);
    user.identifier = event.requestContext.identity.cognitoIdentityId;
    // const user = {name: 'boris', log: 'png', email: 'borisber@gmail.com', identifier: '1234'}
    try {
        const db = firebaseInit(context);
        await db.collection("users").doc(user.email).set(user);
    } catch (e) {
      console.log(e);
    }
    callback(null, success())
}
