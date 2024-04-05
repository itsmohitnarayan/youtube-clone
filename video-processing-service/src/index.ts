import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

app.post("/process-video", (req,res) => {
    const inputFilepath = req.body.inputFilepath;
    const outputFilepath = req.body.outputFilepath;

    if(!inputFilepath || !outputFilepath){
        res.status(400).send("Bad Request: Missing file path.");
    }

    ffmpeg(inputFilepath)
        .outputOptions("-vf", "scale=-1:360") //resolution(360p)
        .on("end", () =>{
            res.status(200).send("Processing Finished Successfully.")
        })
        .on("error", (err) => {
            console.log(`An eroor occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilepath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
      `Video processing service listening at http://localhost:${port}`);
  });