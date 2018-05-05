const success = require('./libs/response').success;

module.exports.main = (event, context, callback) => {
    callback(null, success("BORIS!!"));
}