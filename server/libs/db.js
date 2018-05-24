import mysql from 'mysql';

export default class MySqlDb {
    constructor(poolNumber = 10) {
        this.connection = mysql.createPool({
            connectionLimit : poolNumber,
            host : 'premiergeek.c1t0nwcytv3y.us-east-1.rds.amazonaws.com',
            user : 'noam',
            password : '12345678',
            database : 'noam',
        });
    }

    getConnection() {
        return this.connection;
    }
};