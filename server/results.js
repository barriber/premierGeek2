import  { success } from './libs/response';
import mySqlDb from './libs/db';

function getGameDirection(homeScore, awayScore) {
    if (homeScore === awayScore) {
        return 0;
    }

    return homeScore > awayScore ? 1 : 2;
}
export function main(event, context, callback) {
    const db = new mySqlDb();
    const con = db.getConnection();
    const userId = event.requestContext.identity.cognitoIdentityId;

    const sql = "SELECT * From fixtures " +
        "WHERE fixtures.date < NOW()";
    con.query(sql, function (err, result) {
        console.log(result);
        if (err) {
            console.log('*****************');
            throw err;
        }

        con.end();
        callback(null, success(result));
    });
}
