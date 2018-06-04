import axios from 'axios';
import  { success } from './libs/response';
import {firebaseInit} from "./libs/firebase";


export async function main(event, context, callback) {
    const db = firebaseInit(context);


    const fixtures = await db.collection("fixtures")
        .where('date', '>' , new Date())
        .get();
    const results = [];
    fixtures.forEach(fixture => {
        const {homeTeam, awayTeam, date} = fixture.data();
        results.push ({
            id: fixture.id,
            homeTeam,
            awayTeam,
            date,
        })
    });

    const fixturesPromise = results.map(async fixture => {
        const home = await fixture.homeTeam.get();
        const away = await fixture.awayTeam.get();
        return {
        id: fixture.id,
        homeTeam: home.data(),
        awayTeam: away.data(),
        date: fixture.date
    }
    });

    const final = await Promise.all(fixturesPromise);
    callback(null, success(final));
}

//===GET TEAMS===
// const response = await axios.get('http://api.football-data.org/v1/competitions/467/teams', {
//     headers: {
//         'X-Auth-Token': '5aab4c2c6c8a4af188e5be626459fb78',
//     },
// });
//
// const batch = db.batch();
// const {teams} = response.data;
// teams.forEach(team => {
//     const {name, _links} = team;
//     const link = _links.self.href;
//     const split = link.split('/');
//     const id = parseInt(split[split.length - 1]);
//     const teamRef = db.collection('teams').doc(id.toString());
//     const logo = `https://cdn2.iconfinder.com/data/icons/world-flag-icons/128/Flag_of_${name}.png`
//     batch.set(teamRef, {
//         name,
//         logo,
//     })
// });
// try {
//     await batch.commit();
// callback(null, success());
// } catch (e) {
//     console.log(e);
//
//
// }

//=====GET FIXTURE====
// const response = await axios.get('http://api.football-data.org/v1/competitions/467/fixtures', {
//     headers: {
//         'X-Auth-Token': '5aab4c2c6c8a4af188e5be626459fb78',
//     },
// });
//
// const {fixtures} = response.data;
// const batch = db.batch();
// fixtures.forEach(fixture => {
//     const {date, status, matchday: round, _links: link} = fixture;
//     const awayUrl = link.awayTeam.href.split('/');
//     const homeUrl = link.homeTeam.href.split('/');
//     const split = link.self.href.split('/');
//     const awayTeamId = parseInt(awayUrl[awayUrl.length - 1]);
//     const homeTeamId = parseInt(homeUrl[homeUrl.length - 1]);
//     const id = parseInt(split[split.length - 1]);
//     const dateObj = new Date(date);
//     const fixtureRef = db.collection('fixtures').doc(id.toString());
//     batch.set(fixtureRef, {
//         date: dateObj,
//         status,
//         round,
//         homeTeam: db.doc(`teams/${homeTeamId}`),
//         awayTeam: db.doc(`teams/${awayTeamId}`),
//     })
// });
//
// try {
//     await batch.commit();
// } catch (e) {
//     console.log(e);
// }


// node_modules/.bin/sls invoke local -f fixtures --data {}
