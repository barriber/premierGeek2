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

export function queryDB(query, data) {
    return new Promise((resolve, reject) => {
        const db = new MySqlDb();
        const con = db.getConnection();
        con.query(query, data, (err, results) => {
            if(err) {
                reject(err);
            }
            con.end();
            resolve(results);
        })
    })
}

