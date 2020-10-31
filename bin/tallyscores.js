#!/usr/bin/env node
const boxenOptions = require("../src/configs/boxen.config.js");
const yarsOptions = require("../src/configs/yars.config.js");
const MatchHandler = require("../src/classes/match-handler.js");
const errorMessages = require("../src/constants/error-messages.js");
const boxen = require("boxen");
const chalk = require("chalk");
const fs = require("fs");

function printToConsole(msg) {
  const output = chalk.white.bold(msg);
  const msgBox = boxen(output, boxenOptions);
  console.log(msgBox);
}

try {
  fs.readFile(yarsOptions.file, (err, data) => {
    if (err) {
      const msg = `Error reading file: ${err}`;
      printToConsole(msg);
    } else {
      const content = data.toString();
      // If there is content in the document
      if (content) {
        const matches = content.split("\n");
        const matchHandler = new MatchHandler();
        matchHandler.handle(matches);
        const outputString = matchHandler.outputString;
        printToConsole(outputString);
      } else {
        const msg = errorMessages.emptyFile;
        printToConsole(msg);
      }
    }
  });
} catch (TypeError) {
  const msg = errorMessages.unsupportedFileFormat;
  printToConsole(msg);
}
