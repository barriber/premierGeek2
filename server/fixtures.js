import  { success } from './libs/response';
import con from './libs/db';

export function main(event, context, callback) {
    console.log('EVENT -START')
    console.log(JSON.stringify(event));
    console.log('EVENT -END');
    const sql = "SELECT fixtures.id, fixtures.date, homeTeam.name as homeTeamName, awayTeam.name as awayTeamName, " +
        "awayTeam.logo as awayLogo, homeTeam.logo as homeLogo " +
        "FROM fixtures " +
        "JOIN teams homeTeam ON fixtures.homeTeamId = homeTeam.id " +
        "JOIN teams awayTeam ON fixtures.awayTeamId = awayTeam.id ";
    con.query(sql, function (err, result) {
        console.log('--------');
        if (err) {
            console.log('*****************');
            throw err;
        };

        con.end();
        callback(null, success(result));
    });
}
