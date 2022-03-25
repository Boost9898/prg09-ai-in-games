/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate

    // king is maximizer, wants to reach 100
    // knights is minimizer, wants to reach -100

    public static moveKnight(king: King, knights: Knight[], gameState: GameState) {

        let t0 = performance.now(); // returns a DOMHighResTimeStamp, measured in milliseconds
        let bestMove = this.findBestMove(king, knights, gameState)

        console.log(`Knight ${bestMove[0] + 1} to position [X,Y] [${bestMove[1]}]`);

        gameState.knightPositions[bestMove[0]] = bestMove[1];
        knights[bestMove[0]].setPosition(bestMove[1]);

        let t1 = performance.now();

        console.log(`AI calc time = ${(Math.round((t1 - t0) / 1000))} seconds`);
    }


    static findBestMove(king: King, knights: Knight[], gameState: GameState) {
        console.log('Calculating optimal move');

        let bestMove: [number, [number, number]] = [1, [1, 1]]
        let bestScore = Infinity

        // loop every knight through > loop every move through minimax()
        for (let i = 0; i < knights.length; i++) {
            console.log(`Knight #${(i + 1)} calculating...`);

            knights[i].getMoves().forEach(move => {

                let oldKnightPos = gameState.knightPositions[i]

                // move the move in knight copied gameState
                gameState.knightPositions[i] = move

                // get score of previous gameState (minimax function)
                let moveScore: number = this.minimax(gameState, king, knights, 0, true)

                gameState.knightPositions[i] = oldKnightPos
                // if the score of this move is higher than previous moves update bestMove & bestScore
                if (moveScore < bestScore) {
                    bestMove = [i, move]
                    bestScore = moveScore
                }
            })
        }

        console.log(`AI score: ${bestScore}`);

        return bestMove
    }


    static minimax(gameState: GameState, king: King, knights: Knight[], depth: number, isMaxi: boolean): number {

        let score: [number, boolean] = gameState.getScore(depth)

        if (score[1]) {             // if won or when...
            return score[0]
        } else if (depth > 6) {     // depth iterations are finished, depth means how many layers deep it will calculate (< 6 is very fast | 6 = average | > 6 is slow (device: mbp m1 pro))
            return 0
        }

        // if maximizers turn (knights)
        if (isMaxi) {

            let bestScore = -Infinity

            // for each loop through all possible moves the king can make, and return score
            king.getMoves(gameState.kingPos).forEach(kingMove => {

                let oldKingPos = gameState.kingPos

                // set kingPos to new move
                gameState.kingPos = kingMove

                // return highest score to bestScore
                bestScore = Math.max(bestScore, this.minimax(gameState, king, knights, depth + 1, !isMaxi))

                // set kingPos back
                gameState.kingPos = oldKingPos
            });

            return bestScore
        } else {

            let bestScore = Infinity

            // for each loop through all possible moves the knights can make, and return score
            for (let i = 0; i < knights.length; i++) {
                knights[i].getMoves(gameState.knightPositions[i]).forEach(knightMove => {

                    let oldKnightPos = gameState.knightPositions[i]

                    gameState.knightPositions[i] = knightMove

                    // put the lowest score in bestScore
                    bestScore = Math.min(bestScore, this.minimax(gameState, king, knights, depth + 1, !isMaxi))

                    gameState.knightPositions[i] = oldKnightPos
                });
            }

            return bestScore
        }
    }
}