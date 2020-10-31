const uploadConfig = require("./configs/multer.config.js");
const MatchHandler = require("./classes/match-handler.js");
const errorMessages = require("./constants/error-messages");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const upload = uploadConfig;

const app = express();
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("home", { layout: "main" });
});

app.get("/documentation", (req, res) => {
  res.render("documentation", { layout: "main" });
});

app.post("/upload", upload.single("matches"), (req, res) => {
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      console.log(`Error reading file: ${err}`);
    } else {
      const content = data.toString();
      if (content) {
        const matches = content.split(/\r?\n/);
        const matchHandler = new MatchHandler();
        matchHandler.handle(matches);
        const outputString = matchHandler.outputString;
        res.render("results", { layout: "main", outputString });
      } else {
        const outputString = errorMessages.emptyFile;
        res.render("results", { layout: "main", outputString });
      }
    }
  });
});

app.listen(8080, () => {
  console.log("Server listening on http://localhost:8080...");
});
