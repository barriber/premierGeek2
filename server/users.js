import _ from 'lodash';
import {success} from './libs/response';
import mySqlDb from './libs/db';

export function setUser(event, context, callback) {
    const db = new mySqlDb();
    const con = db.getConnection();
    const obj = _.pick(JSON.parse(event.body), ['name', 'logo', 'email']);
    obj.id = event.requestContext.identity.cognitoIdentityId;
    con.query('INSERT INTO users SET ? ' +
        'ON DUPLICATE KEY UPDATE ?', [obj, obj], function(err) {
        if (err) {
            console.log('*****************');
            throw err;
        }

        con.end();
        callback(null, success())
    });
}