var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'guara'
});

connection.connect();

module.exports = connection; 
//pour exporter cette variable on peut l'utiliser ou on veut --- et cette variable elle sera utiliser des require, autre le require il va nous retouner cette variable "connection