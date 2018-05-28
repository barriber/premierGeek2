import _ from 'lodash';
import {success} from './libs/response';
import {queryDB} from './libs/db';

const query = 'INSERT INTO users SET ? ' +
    'ON DUPLICATE KEY UPDATE ?';

export async function setUser(event, context, callback) {
    const obj = _.pick(JSON.parse(event.body), ['name', 'logo', 'email']);
    obj.id = event.requestContext.identity.cognitoIdentityId;
    await queryDB(query, [obj, obj]);
    
    callback(null, success())
}
