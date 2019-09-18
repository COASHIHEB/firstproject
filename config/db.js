var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'b399df6766fb48',
    password: 'bdb753b4',
    database: 'heroku_69b5684b8aa51e5'
});

/*var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "guara",
    insecureAuth : true
});*/

connection.connect();

module.exports = connection;
//pour exporter cette variable on peut l'utiliser ou on veut --- et cette variable elle sera utiliser des require, autre le require il va nous retouner cette variable "connection