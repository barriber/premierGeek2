import axios from 'axios';
import _ from 'lodash';

const miunte = 60000;
const twoHours =  miunte * 60 * 3;
export async function getFixtures (db, sign) {
    const fixtures = await db.collection("fixtures")
        .where('date', sign , new Date())
        .get();

    return await getFixturesData(fixtures);

}

export async function getFixturesData(fixtures) {
    const results = [];
    fixtures.forEach(fixture => {
        results.push ({
            id: fixture.id,
            ...fixture.data(),
        })
    });

    const fixturesPromise = results.map(async fixture => {
        const {homeTeam, awayTeam, ...rest} = fixture;
        const home = await homeTeam.get();
        const away = await awayTeam.get();
        return {
            homeTeam: home.data(),
            awayTeam: away.data(),
            ...rest,
        }
    });

    return await Promise.all(fixturesPromise);
}

const parseTeamName = function (name) {
    return name.split(' ').join('_').toLowerCase();
}

export async function generateTeams(db) {
    const response = await axios.get('http://api.football-data.org/v1/competitions/467/teams', {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_DATA_ID,
        },
    });

    const batch = db.batch();
    const {teams} = response.data;
    teams.forEach(team => {
        const {name, _links} = team;
        const newName = parseTeamName(name);
        const link = _links.self.href;
        const split = link.split('/');
        const id = parseInt(split[split.length - 1]);
        const teamRef = db.collection('teams').doc(newName);
        const logo = `https://cdn2.iconfinder.com/data/icons/world-flag-icons/128/Flag_of_${_.capitalize(newName)}.png`;
        batch.set(teamRef, {
            name,
            logo,
            footballDataId: id,
        })
    });
    try {
        await batch.commit();
        callback(null, success());
    } catch (e) {
        console.log(e);
    }
}

export async function generateFixtures(db) {
    const response = await axios.get('http://api.football-data.org/v1/competitions/467/fixtures', {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_DATA_ID,
        },
    });

    const {fixtures} = response.data;
    const batch = db.batch();
    const upcomingGames = fixtures.filter(fixture => {
        return new Date(fixture.date) > new Date() && fixture.status === 'TIMED'
    });
    upcomingGames.forEach(fixture => {
        const { date, status, matchday: round, homeTeamName, awayTeamName, _links: link } = fixture;
        const awayTeamId = parseTeamName(awayTeamName);
        const homeTeamId = parseTeamName(homeTeamName);
        const split = link.self.href.split('/');
        const footballDataId = parseInt(split[split.length - 1]);
        const id = `${round}-${homeTeamId}-${awayTeamId}`;
        const dateObj = new Date(date);
        const fixtureRef = db.collection('fixtures').doc(id.toString());
        batch.set(fixtureRef, {
            date: dateObj,
            status,
            round,
            homeTeam: db.doc(`teams/${homeTeamId}`),
            awayTeam: db.doc(`teams/${awayTeamId}`),
            homeTeamScore: 0,
            awayTeamScore: 0,
            footballDataId
        })
    });

    try {
        await batch.commit();
    } catch (e) {
        console.log(e);
    }
}


export async function modifyResults(db) {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour > 10 && currentHour < 22) {
        const lastUpdateRef = await db.collection('utils').doc('syncDates').get();
        const lastUpdate = lastUpdateRef.data().results;
        const modifiedGap = miunte * 7; //7min
        const fromLastTime = now - lastUpdate;
        if (fromLastTime > modifiedGap) {
            const response = await axios.get('http://api.football-data.org/v1/competitions/467/fixtures', {
                headers: {
                    'X-Auth-Token': process.env.FOOTBALL_DATA_ID,
                },
            });
            const {fixtures} = response.data;
            const batch = db.batch();
            const inPlayFixtures = _.filter(fixtures, ({status, date}) => {
                return (status === 'IN_PLAY') || (status === 'FINISHED' && (now - date) < twoHours);
            });
            _.forEach(inPlayFixtures, fixture => {
                const {matchday: round, homeTeamName, awayTeamName, result} = fixture;
                const awayTeamId = parseTeamName(awayTeamName);
                const homeTeamId = parseTeamName(homeTeamName);
                const id = `${round}-${homeTeamId}-${awayTeamId}`;
                const fixtureRef = db.collection('fixtures').doc(id.toString());
                batch.set(fixtureRef, {
                    homeTeamScore: result.goalsHomeTeam || 0,
                    awayTeamScore: result.goalsAwayTeam || 0,
                    status: fixture.status,
                }, {merge: true})
            });
            try {
                const lasyUpdateRef = db.collection('utils').doc('syncDates');
                batch.set(lasyUpdateRef, {results: new Date()}, {merge: true});
                await batch.commit();
                return;
            } catch (e) {
                console.log(e);
            }
        }
    }
    return Promise.resolve();
}

export async function getAllUsers(db) {
    console.log('GET USERS');
    const users = await db.collection('users').get();
    console.log('AGTER GET users!');
    const usersArray = [];
    users.forEach(user => {
        usersArray.push({userId: user.id, ...user.data()});
    });

    return usersArray;
}
