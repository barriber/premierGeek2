export async function getFixtures (db, sign) {
    const fixtures = await db.collection("fixtures")
        .where('date', sign , new Date())
        .get();
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

const parseName = function (name) {
    return name.split(' ').join('_');
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
        const newName = parseName(name);
        const link = _links.self.href;
        const split = link.split('/');
        const id = parseInt(split[split.length - 1]);
        const teamRef = db.collection('teams').doc(newName);
        const logo = `https://cdn2.iconfinder.com/data/icons/world-flag-icons/128/Flag_of_${newName}.png`;
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
    fixtures.forEach(fixture => {
        const { date, status, matchday: round, homeTeamName, awayTeamName } = fixture;
        const awayTeamId = parseName(awayTeamName);
        const homeTeamId = parseName(homeTeamName);
        const id = `${homeTeamId}-${awayTeamId}-round`;
        const dateObj = new Date(date);
        const fixtureRef = db.collection('fixtures').doc(id.toString());
        batch.set(fixtureRef, {
            date: dateObj,
            status,
            round,
            homeTeam: db.doc(`teams/${homeTeamId}`),
            awayTeam: db.doc(`teams/${awayTeamId}`),
            homeTeamScore: 0,
            awayTeamScore: 0.
        })
    });

    try {
        await batch.commit();
    } catch (e) {
        console.log(e);
    }
}


