import { UPLOAD_PATH, app, upload } from './server';
import { Image } from './image';
import * as path from 'path';
import * as fs from 'fs';
import * as del from 'del';

app.get('/image/:id', (req, res, next) => {
    let imgId = req.params.id;
    res.setHeader('Content-type', 'image/jpeg');
    fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
})