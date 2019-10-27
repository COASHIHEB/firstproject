var mysql = require('mysql');

/*const connection = mysql.createConnection({
  host: 'eu-cdbr-west-02.cleardb.net',
  user: 'b399df6766fb48',
  password: 'bdb753b4',
  database: 'heroku_69b5684b8aa51e5'
});*/

const pool = mysql.createPool({
  host: 'eu-cdbr-west-02.cleardb.net',
  user: 'b399df6766fb48',
  database: 'heroku_69b5684b8aa51e5',
  password: 'bdb753b4'
});
setInterval(() => {
  pool.query('SELECT 1', (err, rows) => {
    if (err) throw err;
  });
}, 1000);

/*function handleDisconnect() {
  console.log('coneeeeeeeeeeeeeeeeeeeeeeeeect');
  // Recreate the connection, since
  // the old one cannot be reused.
  connection.connect();                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log(err.code)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {// Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();*/

module.exports = pool;
//pour exporter cette variable on peut l'utiliser ou on veut --- et cette variable elle sera utiliser des require, autre le require il va nous retouner cette variable "connection