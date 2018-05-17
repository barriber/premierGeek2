const success = require('./libs/response').success;
const axios = require('axios');
const mysql = require('mysql');

let con = mysql.createConnection({
    host : 'premiergeek.c1t0nwcytv3y.us-east-1.rds.amazonaws.com',
    user : 'noam',
    password : '12345678',
    database : 'noam',
});
console.log('================');
con.connect(function(err) {
    if(err) {
        console.log('BORIS ERROR!!!!!');
        console.log(err);
    }
});

module.exports.main = (event, context, callback) => {
    console.log('xxxxxxxxx')
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
        console.log(context);
        con.end();
        callback(null, success(result));
    });
}


// const teams = async function() {
//     const response = await axios.get('http://api.football-data.org/v1/competitions/467/teams', {
//         headers: {
//             'X-Auth-Token': '5aab4c2c6c8a4af188e5be626459fb78',
//         },
//     });
//
//     const {teams} = response.data;
//     const x = teams.map(team => {
//         const {name, crestUrl: logo, _links} = team;
//         const link = _links.self.href;
//         const split = link.split('/');
//         const id = parseInt(split[split.length - 1]);
//         return {
//             name,
//             logo,
//             id,
//         }
//     });
//
//     const promises = x.map(team => {
//         return con.query('INSERT INTO Teams SET ?', team)
//     })
//
//     const y = await Promise.all(promises);
//     con.end();
//     callback(null, success(x));
//
// }




// const response = await axios.get('http://api.football-data.org/v1/competitions/467/fixtures', {
//     headers: {
//         'X-Auth-Token': '5aab4c2c6c8a4af188e5be626459fb78',
//     },
// });
//
// const {fixtures} = response.data;
// const x = fixtures.map(fixture => {
//     const {date, status, matchday: round, _links: link} = fixture;
//     const awayUrl = link.awayTeam.href.split('/');
//     const homeUrl = link.homeTeam.href.split('/');
//     const split = link.self.href.split('/');
//     const awayTeamId = parseInt(awayUrl[awayUrl.length - 1]);
//     const homeTeamId = parseInt(homeUrl[homeUrl.length - 1]);
//     const id = parseInt(split[split.length - 1]);
//     return {
//         id,
//         date,
//         status,
//         round,
//         awayTeamId,
//         homeTeamId,
//     }
// });
//
// const promises = x.map(fixture => {
//     return con.query('INSERT INTO fixtures SET ?', fixture)
// });
//
// const y = await Promise.all(promises);
// con.end();
// callback(null, success(x));
