// import pointScales from "../constants/point-scales.js";
// import errorMessages from "../constants/error-messages.js";
const pointScales = require("../constants/point-scales");
const errorMessages = require("../constants/error-messages");
class MatchHandler {
  scores = {};
  rankings = {};
  outputString = "";
  parseFailure = false;
  statusCode = 200;
  handle(matches) {
    for (let i = 0; i < matches.length; i++) {
      const parsedMatches = this.parseMatchData(matches[i]);
      if (parsedMatches) {
        const firstMatch = parsedMatches.firstMatch;
        const secondMatch = parsedMatches.secondMatch;
        const teamOne = this.getTeamRecord(firstMatch);
        const teamTwo = this.getTeamRecord(secondMatch);
        if (teamOne && teamTwo) {
          this.calculateTeamPoints(teamOne, teamTwo);
        } else {
          this.handleParseFailure(errorMessages.unsupportedFileFormat);
          break;
        }
      } else {
        this.handleParseFailure(errorMessages.unsupportedFileFormat);
        break;
      }
    }
    if (!this.parseFailure) {
      let teams = Object.keys(this.scores);
      this.sortTeamsByScore(teams);

      let sortedRankings = Object.keys(this.rankings);

      this.outputString = this.buildOutputString(sortedRankings);
    }
  }

  handleParseFailure(msg) {
    this.outputString = msg;
    this.parseFailure = true;
    this.statusCode = 400;
  }

  assignTeamPoints(team, points) {
    this.scores[team]
      ? (this.scores[team] += points)
      : (this.scores[team] = points);
  }

  calculateTeamPoints(teamOne, teamTwo) {
    if (teamOne.score > teamTwo.score) {
      this.assignTeamPoints(teamOne.name, pointScales.Winner);
      this.assignTeamPoints(teamTwo.name, pointScales.Loser);
    } else if (teamOne.score < teamTwo.score) {
      this.assignTeamPoints(teamTwo.name, pointScales.Winner);
      this.assignTeamPoints(teamOne.name, pointScales.Loser);
    } else {
      this.assignTeamPoints(teamTwo.name, pointScales.Tie);
      this.assignTeamPoints(teamOne.name, pointScales.Tie);
    }
  }

  getTeamRecord(teamMatch) {
    if (teamMatch) {
      return {
        name: teamMatch[1].trim(),
        score: parseInt(teamMatch[2].trim()),
      };
    } else {
      return null;
    }
  }

  parseMatchData(match) {
    const reg_exp = /([\w\s]+)\s+(\d)+/;
    const teamsList = match.split(",");
    if (teamsList.length !== 2) {
      return null;
    }
    const firstMatch = teamsList[0].trim().match(reg_exp);
    const secondMatch = teamsList[1].trim().match(reg_exp);
    return { firstMatch, secondMatch };
  }

  sortTeamsByScore(teams) {
    teams.forEach((team) => {
      const score = this.scores[team];

      // if there are teams tied for this rank add team to list
      if (this.rankings[score]) {
        this.rankings[score].push(team);
      } else {
        this.rankings[score] = [];
        this.rankings[score].push(team);
      }
    });
  }

  buildOutputString(sortedRankings) {
    let rank = 1;
    let outputString = "";
    for (let i = sortedRankings.length - 1; i >= 0; i--) {
      let teamsAtRank = Object.values(this.rankings)[i].sort();
      let rankScore = Object.keys(this.rankings)[i];
      teamsAtRank.map((team) => {
        outputString += `${rank}. ${team} ${rankScore}\n`;
      });
      rank += teamsAtRank.length;
    }
    return outputString;
  }
}

// export default MatchHandler;
module.exports = MatchHandler;
