const pointScales = {
  /**
   * @description The number of points to provide for the winner
   */
  Winner: 3,
  /**
   * @description at the moment 0 points are provided to the loser,
   * but if this changes in the future it will be eaiser to implement
   */
  Loser: 0,

  /** @description The number of points to give both teams in the event of a tie */
  Tie: 1,
};

module.exports = pointScales;
