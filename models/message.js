var connexion = require('../config/db');
var moment = require('../config/moment').moment;

class Message {
    constructor(row) {
        this.row = row;
    }
    get content() {
        return this.row.content;
    }

    get timePosted() {
        return moment(this.row.timePosted);
    }

    get name_user() {
        return this.row.name_user;
    }

    get id() {
        return this.row.id;
    }


    static create(content, userName, CallBack) {
        connexion.query("INSERT INTO message_user SET content = ?, name_user = ?, timePosted = ?", [content, userName, new Date()], funcEND);
        function funcEND(err, result) {
            if (err) throw err
            CallBack(result);
        }
    }

    static all(CallBack) {
        connexion.query("SELECT * FROM message_user ORDER BY id DESC", funcEnd);
        function funcEnd(err, rows) {
            if (err) throw err;
            CallBack(rows.map((row) => new Message(row)));
        }
    }

    static find(id, CallBack) {
        connexion.query("SELECT * FROM message_user WHERE id = ? LIMIT 1", [id], funcEnd);
        function funcEnd(err, rows) {
            if (err) throw err;
            CallBack(new Message(rows[0]));
        }
    }
}

module.exports = Message;