import  { success } from './libs/response';
import mySqlDb from './libs/db';

export function main(event, context, callback) {
    const db = new mySqlDb();
    const con = db.getConnection();
    const userId = event.requestContext.identity.cognitoIdentityId;
    // const userId = 'us-east-1:ac69580b-ce54-4e10-a6ed-c83828c5419c';
    const sql = "SELECT fixtures.id, fixtures.date, homeTeam.name as homeTeamName, awayTeam.name as awayTeamName, " +
        "awayTeam.logo as awayLogo, homeTeam.logo as homeLogo, " +
        "bet.homeTeamScore as betHomeTeam, bet.awayTeamScore as betAwayTeam " +
        "FROM fixtures " +
        "JOIN teams homeTeam ON fixtures.homeTeamId = homeTeam.id " +
        "JOIN teams awayTeam ON fixtures.awayTeamId = awayTeam.id " +
        `LEFT JOIN bets bet ON fixtures.id = bet.fixtureId AND bet.userId = "${userId} "` +
        "WHERE fixtures.date > NOW()";
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
