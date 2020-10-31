const MatchHandler = require("./match-handler");
const pointScales = require("../constants/point-scales");
const errorMessages = require("../constants/error-messages");
const goodMatches = [
  "Falcons 3, Snakes 0",
  "Diamonds 2, Red Pandas 3",
  "Gophers 2, Tigers 2",
  "Lions 1, Bears 2",
  "Falcons 2, Bears 4",
  "Red Pandas 1, Snakes 3",
  "Diamonds 3, Gophers 3",
  "Tigers 3, Lions 2",
];

const badMatches = [
  "Diamonds 3, Gophers 3",
  "Tigers 3, Lions 2",
  "Red Pandas 1, Snakes 3 Diamonds 3, Gophers 3",
  "Tigers 3, Lions 2",
];

describe("#assignTeamPoints", () => {
  test("it add the designated amount of points to the winner", () => {
    const matchHandler = new MatchHandler();
    matchHandler.assignTeamPoints("Falcons", pointScales.Winner);
    expect(matchHandler.scores["Falcons"]).toEqual(pointScales.Winner);
    matchHandler.assignTeamPoints("Falcons", pointScales.Winner);
    expect(matchHandler.scores["Falcons"]).toEqual(pointScales.Winner * 2);
  });

  test("it add the team to the list of scores without adding any points for the loser", () => {
    const matchHandler = new MatchHandler();
    matchHandler.assignTeamPoints("Falcons", pointScales.Loser);
    expect(matchHandler.scores["Falcons"]).toEqual(pointScales.Loser);
  });

  test("it add the designated tie points to both teams when there is a tie", () => {
    const matchHandler = new MatchHandler();
    matchHandler.assignTeamPoints("Falcons", pointScales.Tie);
    matchHandler.assignTeamPoints("Snakes", pointScales.Tie);
    expect(matchHandler.scores["Falcons"]).toEqual(pointScales.Tie);
    expect(matchHandler.scores["Falcons"]).toEqual(pointScales.Tie);
  });
});

describe("#parseMatchData", () => {
  test("it will return two teams with their accompany scores with the proper data set", () => {
    const matchHandler = new MatchHandler();
    const parsedMatches = matchHandler.parseMatchData(goodMatches[0]);
    expect(parsedMatches.firstMatch[0]).toEqual("Falcons 3");
    expect(parsedMatches.secondMatch[0]).toEqual("Snakes 0");
  });

  test("it will return null when provided with bad data", () => {
    const matchHandler = new MatchHandler();
    const parsedMatches = matchHandler.parseMatchData(badMatches[2]);
    expect(parsedMatches).toBeNull();
  });
});

describe("#calculateTeamPoints", () => {
  test("it adds the proper amount of points if teamOne Wins", () => {
    const matchHandler = new MatchHandler();
    const teamOne = { name: "Falcons", score: 3 };
    const teamTwo = { name: "Snakes", score: 2 };
    matchHandler.calculateTeamPoints(teamOne, teamTwo);
    expect(matchHandler.scores[teamOne.name]).toEqual(pointScales.Winner);
    expect(matchHandler.scores[teamTwo.name]).toEqual(pointScales.Loser);
  });

  test("it adds the proper amount of points if teamTwo Wins", () => {
    const matchHandler = new MatchHandler();
    const teamOne = { name: "Falcons", score: 2 };
    const teamTwo = { name: "Snakes", score: 3 };
    matchHandler.calculateTeamPoints(teamOne, teamTwo);
    expect(matchHandler.scores[teamOne.name]).toEqual(pointScales.Loser);
    expect(matchHandler.scores[teamTwo.name]).toEqual(pointScales.Winner);
  });

  test("it adds equal amount of points for tie games", () => {
    const matchHandler = new MatchHandler();
    const teamOne = { name: "Falcons", score: 3 };
    const teamTwo = { name: "Snakes", score: 3 };
    matchHandler.calculateTeamPoints(teamOne, teamTwo);
    expect(matchHandler.scores[teamOne.name]).toEqual(pointScales.Tie);
    expect(matchHandler.scores[teamTwo.name]).toEqual(pointScales.Tie);
  });
});

describe("#sortTeamsByScore", () => {
  test("it creates an array for a team in the score object array if no teams already assist", () => {
    const matchHandler = new MatchHandler();
    matchHandler.scores = {
      Falcons: 3,
      Lions: 1,
      "Red Pandas": 6,
    };
    const teams = ["Falcons", "Lions"];
    matchHandler.sortTeamsByScore(teams);
    expect(matchHandler.rankings[3]).toEqual(["Falcons"]);
    expect(matchHandler.rankings[1]).toEqual(["Lions"]);
  });

  test("it adds a team to an array of items if a team already exists with the score", () => {
    const matchHandler = new MatchHandler();
    matchHandler.scores = {
      Falcons: 3,
      Lions: 1,
      "Red Pandas": 3,
    };
    const teams = ["Falcons", "Lions", "Red Pandas"];
    matchHandler.sortTeamsByScore(teams);
    expect(matchHandler.rankings[3]).toEqual(["Falcons", "Red Pandas"]);
    expect(matchHandler.rankings[1]).toEqual(["Lions"]);
  });
});

describe("#handle", () => {
  test("it properly parses when given correctly formatting files", () => {
    const matchHandler = new MatchHandler();
    matchHandler.handle(goodMatches);
    expect(matchHandler.statusCode).toEqual(200);
    expect(matchHandler.parseFailure).toEqual(false);
    expect(matchHandler.scores["Bears"]).toEqual(6);
    expect(matchHandler.rankings[3]).toEqual([
      "Falcons",
      "Red Pandas",
      "Snakes",
    ]);
  });

  test("it returns with an error is the file is not formatted properly", () => {
    const matchHandler = new MatchHandler();
    matchHandler.handle(badMatches);
    expect(matchHandler.statusCode).toEqual(400);
    expect(matchHandler.parseFailure).toEqual(true);
    expect(matchHandler.outputString).toEqual(
      errorMessages.unsupportedFileFormat
    );
  });
});
