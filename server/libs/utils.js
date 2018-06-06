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
};
