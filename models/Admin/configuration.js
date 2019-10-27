var connexion = require('../../config/db');
class configuration {
    constructor(row) {
        this.row = row;
    }


    static getSlides(CallBack) {
        let slides = [];
        connexion.query("SELECT * from slides LEFT JOIN offre On offre.idOffre = slides.idOffre ORDER BY numberClass", (err, rows) => {
            if (err) CallBack("error");
            rows.forEach(function (row) {
                let slide = {
                    idSlide: row.idSlide,
                    namePicture: row.namePicture,
                    title: row.title,
                    idOffre: row.idOffre,
                    nomOffre: row.nom,
                    description: row.description,
                    prix: row.prix,
                    numberClass: row.numberClass,
                };
                slides.push(slide);
            });
            CallBack(slides);
        })
    }

    static getOffre(CallBack) {
        let offres = [];
        let i = 0;
        connexion.query("SELECT * from offre", (err, rows) => {
            if (err) CallBack("error");
            rows.forEach(function (row) {
                let offre = {
                    idOffre: row.idOffre,
                    nomOffre: row.nom
                };
                offres.push(offre);
            });
            CallBack(offres);
        })
    }


    static addNewSlide(inputs, CallBack) {
        var namePicture = inputs.namePicture;
        var inputs = inputs.data;
        var idOffre = inputs.newNomOffre;
        idOffre = idOffre.split(" ");
        idOffre = idOffre[0];
        idOffre = parseInt(idOffre)
        connexion.query("insert into slides(namePicture,title,idOffre,numberClass) values(?,?,?,?)  ",
            [namePicture, inputs.newTitle, idOffre, inputs.newNumberClass], (err, rows) => {
                if (err) throw err;
                CallBack("done");
            });
    }


    static deleteSlide(inputs, CallBack) {
        connexion.query("delete from slides where idSlide=? ",
            [inputs.idSlide], (err, rows) => {
                if (err) throw err;
                CallBack("done");
            });
    }


    static updateSlide(inputs, CallBack) {
        var idOffre = inputs.nomOffre;
        idOffre = idOffre.split(" ");
        idOffre = idOffre[0];
        connexion.query("update slides SET title=?, idOffre=? ,numberClass=? where idSlide=? ",
            [inputs.title, idOffre, inputs.numberClass, inputs.idSlide], (err, rows) => {
                if (err) throw err;
                CallBack("done");
            });
    }
}




module.exports = configuration;