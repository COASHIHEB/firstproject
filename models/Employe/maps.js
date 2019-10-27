var connexion = require('../../config/db');
var date = require('../../config/moment').date;
var moment = require('../../config/moment').moment;
var dateTime = require('../../config/moment').dateTime;
date = date + '%';


class maps {



    static changeLocation(inputs, CallBack) {


        connexion.query("UPDATE employe SET  longitude = ? , latitude = ? , lastModified = NOW() WHERE (utilisateur_idUtil = ?)", [inputs.longitude, inputs.latitude, inputs.id], (err, result) => {
            if (err) {
                throw err;
                CallBack('error');
            }
            else {
                console.log("location updated")
                CallBack("done");
            }
        });
    }

    static getEmployeConnected(CallBack) {
        connexion.query("( select idEmp, longitude , latitude, dateFinRealisation ,adress as adressPourSonDernierClient from employe left join commande c1 on employe.idEmp = c1.Employe_idEmp where dateFinRealisation = (select max(dateFinRealisation) from commande c2  where c1.Employe_idEmp = c2.Employe_idEmp) and dateFinRealisation like(?) and lastModified >= NOW() - 120 GROUP BY idEmp) UNION (select idEmp, longitude, latitude, adress as adressPourSonDernierClient, dateFinRealisation from employe left join commande on employe.idEmp = commande.Employe_idEmp where idEmp not in (select Employe_idEmp from commande where dateFinRealisation like(?)) and lastModified >= NOW() - 120  ) ", [date, date], (err, rows) => {
            if (err) throw err;
            else {
                let employes = [];
                rows.forEach(function (row) {
                    let employe = {
                        idEmp: row.idEmp,
                        longitude: row.longitude,
                        latitude: row.latitude,
                        dateFinRealisation: row.dateFinRealisation,
                        adressPourSonDernierClient: row.adressPourSonDernierClient
                    };
                    employes.push(employe);
                });
                CallBack(employes);
            }
        })
    }

    static accepterUneNouvelleCommande(inputs, CallBack) {

        // on a besoin de recuperer idCommande , idEmp
        console.log(" inputs of accepterUneNouvelleCommande")
        console.log(inputs)
        // on a besoin d'inserer date arrivé 
        let duree1, a = "00:00:00";
        let dateDebutRealisation;
        let dateFinRealisation;
        connexion.query("select dateDebutRealisation from commande where idCommande = ?", [inputs.idCommande], (err, rows) => {
            if (err) throw err;
            else {
                rows.forEach(function (row) {
                    dateDebutRealisation = row.dateDebutRealisation
                });
                CallBack("date debut realisation :" + dateDebutRealisation)
                connexion.query("select dure from commande , offre , commandeoffre where commande.idCommande = commandeoffre.Commande_idCommande and offre.idOffre = commandeoffre.Offre_idOffre and idCommande = ?", [inputs.idCommande], (err, rows) => {
                    if (err) {
                        throw err;
                        CallBack('error');
                    }
                    else {
                        rows.forEach(function (row) {
                            duree1 = row.dure.replace(" h ", ":").replace(" min", "").split(":");
                            a = moment(a).add(parsInt(duree1[0]), 'hours').format("HH:MM:SS");
                            a = moment(a).add(parsInt(duree1[1]), 'minutes').format("HH:MM:SS");
                        });
                        console.log(a)
                        a = a.splitr(":");
                        dateFinRealisation = moment(dateDebutRealisation).format("YYYY-MM-DD HH:MM:SS");
                        dateFinRealisation = moment(dateFinRealisation).add(parsInt(a[0]), 'hours').format("YYYY-MM-DD HH:MM:SS");
                        dateFinRealisation = moment(dateFinRealisation).add(parsInt(a[1]), 'minutes').format("YYYY-MM-DD HH:MM:SS");
                        console.log("dateFinRealisation ")
                        console.log(dateFinRealisation)
                        connexion.query("select idEmp from commande where utilisateur_idUtil = ?", [inputs.idUtil], (err, employes) => {
                            let idEmp;
                            if (err) throw err;
                            else {
                                employes.forEach(function (row) {
                                    idEmp = row.idEmp
                                });
                                console.log("idEmp : " + idEmp)
                                connexion.query("UPDATE commande SET  statut = 'non faite' ,  dateFinRealisation = ? ,Employe_idEmp=? WHERE (idCommande = ?)", [dateFinRealisation, idEmp], (err, result) => {
                                    if (err) {
                                        throw err;
                                        CallBack('error');
                                    }
                                    else {
                                        CallBack("done");
                                    }
                                });
                            }

                        })

                    }
                })
            }
        })
    }

    static ajouterUneCommandeEnAttente(inputs, CallBack) {
        connexion.query("insert into commandeEnAttente (idCommande, idEmp) values (?,?,?) ", [inputs.idCommande, inputs.idEmp], (err, rows) => {
            if (err) throw err;
            else {
                connexion.query("update commande set dateDebutRealisation = ? where idCommande = ? ", [inputs.dateArrive, inputs.idEmp], (err, rows) => {
                    if (err) throw err;
                    else {
                        CallBack("done");
                    }
                })
            }
        })
    }

    static refuserUneCommande(inputs, CallBack) {
        connexion.query("delete from commandeEnAttente where idCommande=? ", [inputs.idCommande], (err, rows) => {
            if (err) throw err;
            else {
                CallBack("done")
            }
        })
    }


    static verifyIdEmploye(inputs, CallBack) {
        connexion.query("select Employe_idEmp from commande where idCommande = ?", [inputs.idCommande], (err, rows) => {
            if (err) throw err;
            else {
                rows.forEach(function (row) {
                    let idEmp = row.Employe_idEmp;
                    idEmp = parseInt(idEmp)
                    if (idEmp == parseInt(inputs.id)) {
                        CallBack("done");
                    }
                    else {
                        CallBack("error");
                    }
                });
            }
        })
    }


    static verifyIdClient(inputs, CallBack) {
        connexion.query("select adherent_idadh from commande where idCommande = ?", [inputs.idCommande], (err, rows) => {
            if (err) throw err;
            else {
                rows.forEach(function (row) {
                    let idClient = row.adherent_idadh;
                    idClient = parseInt(idClient)
                    if (idClient == parseInt(inputs.id)) {
                        CallBack("done");
                    }
                    else {
                        CallBack("error");
                    }
                });
            }
        })
    }

    static getAdresseCommande(inputs, CallBack) {
        connexion.query("select adress from commande where idCommande = ?", [inputs.idCommande], (err, rows) => {
            if (err) {
                throw err;
                CallBack({ statut: "error" });
            }
            else {
                rows.forEach(function (row) {
                    CallBack({ statut: "done", adress: row.adress });
                });
            }
        })
    }

}



module.exports = maps;