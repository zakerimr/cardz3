/**
 * @file game.js - Responsible for setting up the game and the recursing the gameplay loop.
 */

import { shuffleArray } from "./util.js";
import { getActions, doAction } from "./action.js";
// import * as readline from "node:readline";

/** @import {stateObj} from "./typedefs.js"*/

/**
 * Set up the game using hardcoded defaults
 * @returns {stateObj} - The gameState object using default values.
 */
export const setupGame = () => {
  const TOWER_BASE = "AS";
  const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, "A", "K", "Q", "J", "T"];
  const SUITS = ["C", "D", "H", "S"];

  let deck = [];
  for (const RANK of RANKS) {
    for (const SUIT of SUITS) {
      let rs = `${RANK}${SUIT}`;
      if (rs === TOWER_BASE) {
        continue;
      }
      deck.push(rs);
    }
  }
  let shuffledDeck = shuffleArray(deck);

  return {
    playerDeck: shuffledDeck.splice(0, 25),
    playerHand: shuffledDeck.splice(0, 5),
    enemyCard: shuffledDeck.shift(),
    enemyDeck: shuffledDeck,
    tower: [TOWER_BASE],
  };
};

/*

/**
 * Log the game's current state to console.
 * @param {stateObj} gameState - The gameState object
 */
// const logGameState = (gameState) => {
//   console.log(`=================================
// Hand: ${gameState.playerHand}
// Enemy Card: ${gameState.enemyCard}
// Tower (+${Math.floor(gameState.tower.length / 2)}): ${gameState.tower}
// PD: ${gameState.playerDeck.length} | ED: ${gameState.enemyDeck.length}
// Actions: ${[...getActions(gameState)].map((action) => action.type)}
// `);
// };

// (() => {
//   let gameState = setupGame();

//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   /**
//    * The main gameplay loop.
//    * Recursively calls itself, but does not risk stack overflow due to rl.question being asynchronous (uses a callback function).
//    */

//   const playGame = () => {
//     logGameState(gameState);

//     if (!gameState.enemyCard && gameState.enemyDeck.length <= 0) {
//       console.log("GAME COMPLETE! You won!");
//       return rl.close();
//     }

//     const actionSet = getActions(gameState);

//     if (actionSet.size <= 0) {
//       console.log("GAME OVER! You lost.");
//       return rl.close();
//     }

//     rl.question("Perform which action? ", (input) => {
//       if (input.toLowerCase() === "exit") {
//         console.log("Closing game...");
//         return rl.close();
//       }

//       const [actionType, card] = input.toUpperCase().split(" ");

//       const actionObj = [...actionSet].find((a) => a.type === actionType);

//       if (!actionObj) {
//         console.log(`Invalid action ${actionType}!`);
//         playGame();
//         return;
//       }

//       if (
//         actionObj.cards.length > 0 &&
//         !actionObj.cards.includes(card) &&
//         card !== gameState.tower.at(-1) //&& valid
//       ) {
//         console.log(`Card ${card} invalid for action ${actionType}`);
//         playGame();
//         return;
//       }

//       doAction(actionObj, card, gameState);
//       playGame();
//     });
//   };

//   playGame();
// })();
