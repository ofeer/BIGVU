import express from "express";
import bodyParser from "body-parser";
import captureWebsite from 'capture-website';
import fs from 'fs';
import videoshow from 'videoshow';
import { isWebUri } from 'valid-url';
import ffmpegPath  from '@ffmpeg-installer/ffmpeg';
import ffmpeg  from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

const port = 3000;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port);


var url;

var videoOptions = {
    fps: 25,
    loop: 10, // seconds
    transition: true,
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
  }


app.post('/', async (req, res) =>  {
    // get Json input
    url = req.body.url;

    // delete files if exists
    deleteFile('screenshot.png')
    deleteFile('video.mp4')

    // validate url
    if (!isWebUri(url))
        res.send("The url is unvalid, pls check your self and try again")
    
   else {  
        // taking screen shot
        await captureWebsite.file(url, 'screenshot.png');

        // trasnforming png to mp4
        await videoshow(['screenshot.png'], videoOptions)
        .save('video.mp4')
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Video created in:', output)
        })

        // send response
        res.send({file : "C:/Users/ofeer/Desktop/BIGVU/express-es6-starter/video.mp4"});
    }
})



const deleteFile = (file) => {
    fs.unlink(file, (err) => {
       // error handeling
    });
}

