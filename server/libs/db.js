import mysql from 'mysql';

let connectionPool = mysql.createPool({
    connectionLimit : 5,
    host : 'premiergeek.c1t0nwcytv3y.us-east-1.rds.amazonaws.com',
    user : 'noam',
    password : '12345678',
    database : 'noam',
});

export default connectionPool;