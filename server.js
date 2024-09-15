const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

const uploadDir = path.join(__dirname, "uploads");
const port = 3000;
let fileExists = false;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        const filePath = path.join(uploadDir, file.originalname);

        if (fs.existsSync(filePath)) {
            console.log("File exists");
            // cb(new Error("File already exists."));
            fileExists = true;
            return cb(null, false);
        }
        fileExists = false;
        cb(null, true);
    },
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/", upload.single("file"), (req, res) => {
    fileExists ? res.status(400).send("File exists") : res.status(200).send("Ok");
});

app.listen(port, () => {
    console.log("Started server at port " + port);
});
