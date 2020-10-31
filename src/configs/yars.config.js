const yargs = require("yargs");

const yarsOptions = yargs(process.argv.slice(2))
  .usage("Usage: -f <file>")
  .option("f", {
    alias: "file",
    describe: "The scores file you wish to tally",
    type: "string",
    demandOption: true,
  }).argv;

module.exports = yarsOptions;
