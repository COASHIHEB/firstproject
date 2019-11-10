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






    static getLastCommandeEmploye(inputs, CallBack) {

        var idEmp;
        connexion.query(" select idEmp from employe where utilisateur_idUtil = ?", [inputs.id], (err, rowss) => {
            if (err) throw err;
            else {
                idEmp = rowss[0].idEmp;
                connexion.query(" select * from commande where Employe_idEmp = ? and dateFinRealisation like(?) and dateFinRealisation = (select max(dateFinRealisation) from commande where Employe_idEmp=?)", [idEmp, date, idEmp], (err, rows) => {
                    if (err) throw err;
                    else {
                        if (rows.length) {
                            CallBack({
                                dateFinRealisation: rows[0].dateFinRealisation,
                                adressPourSonDernierClient: rows[0].adress,
                                statut: "done"
                            });
                        }
                        else {
                            CallBack({
                                dateFinRealisation: null,
                                adressPourSonDernierClient: null,
                                statut: "done"
                            });
                        }

                    }
                })
            }
        })
    }


    static recupererLesEmployesQuiOntRefuseCetteCommande(inputs, CallBack) {
        connexion.query("select idEmp from commandeRefuse where idCommande = ?", [inputs.idCommande], (err, rows) => {
            if (err) throw err;
            else {
                let employes = [];
                rows.forEach(function (row) {
                    let employe = {
                        idEmp: row.idEmp,
                    };
                    employes.push(employe);
                });
                CallBack({ statut: "done", employes: employes });
            }
        })
    }










    static getEmployeConnected(CallBack) {
        console.log("date")
        console.log(date)
        connexion.query("( select idEmp, longitude , latitude, dateFinRealisation ,adress as adressPourSonDernierClient from employe left join commande c1 on employe.idEmp = c1.Employe_idEmp where dateFinRealisation = (select max(dateFinRealisation) from commande c2  where c1.Employe_idEmp = c2.Employe_idEmp) and dateFinRealisation like(?) and lastModified >= NOW() - 120 GROUP BY idEmp) UNION (select idEmp, longitude, latitude, adress as adressPourSonDernierClient, dateFinRealisation from employe left join commande on employe.idEmp = commande.Employe_idEmp where idEmp not in (select Employe_idEmp from commande where dateFinRealisation like(?)) and lastModified >= NOW() - 120 group by idEmp ) ", [date, date], (err, rows) => {
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
                    console.log("model maps ligne 40 mysql hbal : ")

                    employes.push(employe);
                });
                console.log("employes : ")
                console.log(employes)

                CallBack(employes);
            }
        })
    }

    static accepterUneNouvelleCommande(inputs, CallBack) {
        // on a besoin de recuperer idCommande , idEmp
        // on a besoin d'inserer date arrivé 
        let duree;
        let dateDebutRealisation = inputs.dateArrive;
        let dateFinRealisation;

        connexion.query("select dure from commande , offre , commandeoffre where commande.idCommande = commandeoffre.Commande_idCommande and offre.idOffre = commandeoffre.Offre_idOffre and idCommande = ?", [inputs.idCommande], (err, rows) => {
            console.log(rows)
            if (err) {
                throw err;
                CallBack('error');
            }
            else {
                var hours = 0;
                var minutes = 0;
                rows.forEach(function (row) {
                    duree = row.dure.replace(" h ", ":").replace(" min", "").split(":");
                    hours += parseInt(duree[0]);
                    minutes += parseInt(duree[1]);
                });
                dateFinRealisation = moment(dateDebutRealisation).add(hours, 'hours').add(minutes, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                dateDebutRealisation = moment(dateDebutRealisation).format("YYYY-MM-DD HH:mm:ss");
                console.log("dateDebutRealisation : " + dateDebutRealisation)
                console.log("dateFinRealisation   : " + dateFinRealisation)
                connexion.query("select idEmp from employe where utilisateur_idUtil = ?", [inputs.idUtil], (err, employes) => {
                    let idEmp;
                    if (err) throw err;
                    else {
                        employes.forEach(function (row) {
                            idEmp = row.idEmp
                        });
                        connexion.query("UPDATE commande SET  statut = 'non faite' , dateDebutRealisation=?, dateFinRealisation = ? ,Employe_idEmp=? WHERE (idCommande = ?)", [dateDebutRealisation, dateFinRealisation, idEmp, inputs.idCommande], (err, result) => {
                            if (err) {
                                throw err;
                                CallBack('error');
                            }
                            else {
                                connexion.query("delete from commandeEnAttente where idEmp = ? and idCommande = ?", [idEmp, inputs.idCommande], (err, result) => {
                                    if (err) {
                                        throw err;
                                        CallBack('error');
                                    }
                                    else {
                                        connexion.query("select utilisateur_idUtil from commande , adherent where commande.adherent_idadh = adherent.idadh and idCommande = ?", [inputs.idCommande], (err, idClient) => {
                                            if (err) {
                                                throw err;
                                                CallBack('error');
                                            }
                                            else {
                                                CallBack({
                                                    statut: "done",
                                                    idClient: idClient[0].utilisateur_idUtil
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })

            }
        })
    }


    static ajouterUneCommandeEnAttente(inputs, CallBack) {
        connexion.query("insert into commandeEnAttente (idCommande, idEmp) values (?,?) ", [inputs.idCommande, inputs.idEmp], (err, rows) => {
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
        connexion.query("delete from commandeEnAttente where idCommande=? ", [inputs.idCommande], (err) => {
            if (err) throw err;
            else {
                connexion.query("select idEmp from employe where utilisateur_idUtil = ? ", [inputs.idUtil], (err, rows) => {
                    if (err) throw err;
                    else {
                        connexion.query("insert into commandeRefuse (idCommande , idEmp) values (?,?) ", [inputs.idCommande, rows[0].idEmp], (err) => {
                            if (err) throw err;
                            else {
                                CallBack("done")
                            }
                        })
                    }
                })
            }
        })
    }

    static verifyIdEmploye(inputs, CallBack) {
        connexion.query("select idEmp from commandeenattente where idCommande = ?", [parseInt(inputs.idCommande)], (err, rows) => {
            if (err) throw err;
            else {
                console.log(rows)
                let idEmp = rows[0].idEmp;
                idEmp = parseInt(idEmp)
                console.log(idEmp)
                connexion.query("select utilisateur_idUtil from employe where idEmp = ?", [idEmp], (err, rowsss) => {
                    if (err) throw err;
                    else {
                        console.log(parseInt(rowsss[0].utilisateur_idUtil))
                        if (inputs.id == parseInt(rowsss[0].utilisateur_idUtil)) {
                            CallBack("done");
                        }
                        else {
                            CallBack("error");
                        }
                    }
                });
            }
        })
    }


    static verifyIdCommande(inputs, CallBack) {
        let idCommande = parseInt(inputs.idCommande);
        console.log("idCommande : " + idCommande)
        connexion.query("select utilisateur_idUtil  , dateDebutRealisation  from commande , adherent where commande.adherent_idadh = adherent.idadh and idCommande = ?", [idCommande], (err, rows) => {
            if (err) throw err;
            else {
                let idClient = rows[0].utilisateur_idUtil;
                idClient = parseInt(idClient)
                if (idClient == parseInt(inputs.id)) {
                    CallBack({
                        statut: "done",
                        dateDebutRealisation: rows[0].dateDebutRealisation,
                    });
                }
                else {
                    CallBack("error");
                }
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
                CallBack({ statut: "done", adress: rows[0].adress });
            }
        })
    }


    static getAdresserecupererToutesLesCommandesEnAttentesDeCetEmployeCommande(inputs, CallBack) {
        connexion.query("select idEmp from employe where utilisateur_idUtil = ?", [inputs], (err, rows) => {
            if (err) {
                throw err;
                CallBack({ statut: "error" });
            }
            else {
                connexion.query("select idCommande from commande where idEmp = ?", [rows[0].idEmp], (err, list) => {
                    if (err) {
                        throw err;
                        CallBack({ statut: "error" });
                    }
                    else {
                        connexion.query("delete from commandeEnAttente where idEmp = ?", [rows[0].idEmp], (err) => {
                            if (err) {
                                throw err;
                                CallBack({ statut: "error" });
                            }
                            else {
                                CallBack({ statut: "done", commande: list });
                            }
                        })
                    }
                })
            }
        })
    }

}



module.exports = maps;