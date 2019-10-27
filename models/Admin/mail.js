var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;


class Stock {

    constructor(row) {
        this.row = row;
    }


    static getMails(CallBack) {
        connexion.query("SELECT * FROM mail left join utilisateur on utilisateur.idUtil=mail.idClient ", [], (err, rows) => {
            if (err) CallBack(err);
            let mails = [];
            rows.forEach(function (row) {
                let mail = {
                    idMail: row.idMail,
                    nom: row.nom,
                    prenom: row.prenom,
                    email: row.email,
                    numTel: row.numTel,
                    image: row.image,
                    dateMail: moment(row.dateMail).format('YYYY-MM-DD'),
                    sujet: row.sujet,
                    text: row.text,
                    vu: row.vu
                };
                mails.push(mail);
            });
            CallBack(mails);
        });
    }


    static deleteMail(inputs, CallBack) {
        connexion.query("delete from mail where idMail = ? ", [inputs.idMail], funcEnd);
        function funcEnd(err) {
            if (err) {
                CallBack('error');
            } else {
                CallBack('done');
            }
        }
    }

    static readMail(idMail, CallBack) {
        connexion.query("SELECT * FROM mail left join utilisateur on utilisateur.idUtil=mail.idClient where idMail = ?", [idMail], (err, rows) => {
            if (err) CallBack('error');
            connexion.query("update mail set vu=1 where idMail = ?", [idMail], (error) => {
                if (err || error) CallBack('error');
                rows.forEach(function (row) {
                    let mail = {
                        idMail: row.idMail,
                        nom: row.nom,
                        prenom: row.prenom,
                        email: row.email,
                        numTel: row.numTel,
                        image: row.image,
                        dateMail: moment(row.dateMail).format('YYYY-MM-DD'),
                        sujet: row.sujet,
                        text: row.text,
                        vu: row.vu
                    };
                    CallBack(mail);
                });
            });

        });
    }

    static sendMailLocal(inputs, CallBack) {
        var inputs = inputs.data;
        var idClient = inputs.idClient;
        var dateNow = moment().format('YYYY-MM-DD');
        connexion.query("insert into mail (idClient,sujet,text,dateMail) values(?,?,?,?) ", [idClient, inputs.sujet, inputs.text, dateNow], funcEnd);
        function funcEnd(err) {
            if (err) {
                CallBack('error');
            } else {
                CallBack('done');
            }
        }
    }


}

module.exports = Stock;