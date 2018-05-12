const success = require('./libs/response').success;
const axios = require('axios');

module.exports.main = async (event, context, callback) => {
    const {data: fixtures} = await axios.get('http://api.football-data.org/v1/competitions/467/teams', {
        headers: {
            'X-Auth-Token': '5aab4c2c6c8a4af188e5be626459fb78',
        },
    });

    callback(null, success(fixtures));
}
