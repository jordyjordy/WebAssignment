var gameStats = {  
    currentGames : 0,  /* since we keep it simple and in-memory, keep track of when this object was created */
    whiteWins : 0,   /* number of games initialized */
    blackWins : 0,       /* number of games aborted */
    gamesPlayed : 0, 
    gamesCancelled : 0, 
    gamesCompleted : 0    /* number of games successfully completed */
};

module.exports = gameStats;