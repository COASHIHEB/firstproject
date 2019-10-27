var multer = require('multer');
var path = require('path');
var fs = require('fs');
var express = require("express");
var cors = require("cors");
var app = express.Router();
var del = require("del");
app.use(cors());
let UPLOAD_PATH = 'public/images';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now());
    }
});
let upload = multer({ storage: storage });

app.get('/image', (req, res, next) => {
    let image = "slides/bg.jpg";
    res.setHeader('Content-type', 'image/jpeg');
    fs.createReadStream(path.join(UPLOAD_PATH, image)).pipe(res);
});

// single('image') => image est un clé pour l'utiliser en ionic
app.post('image', upload.single('image'), (req, res, next) => {
    let namePicture = req.file.filename;
    console.log(req.file)
});

app.get('/deleteImage', (req, res, next) => {
    let image = "slides/bg.jpg";
    del([path.join(UPLOAD_PATH, image)]).then(deleted => {
        console.log("doneeeeeeee");
        res.json("done");
    })
})


module.exports = app;