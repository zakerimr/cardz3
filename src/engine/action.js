/**
 * @file action.js - Manages the player actions, determining which actions they can play and their implementations.
 * All game actions mutate gameState in place by design.
 */

import { getValue, getColor, getCombos } from "./util.js";

/** @import {stateObj, actionObj} from "./typedefs.js"*/

/**
 * Removes card from the player's hand, replacing it with a new card from playerDeck if possible.
 * @param {string} card The two-character card descriptor.
 * @param {stateObj} gameState The gameState object.
 */
const removeFromHand = (card, gameState) => {
  // Recursively additives
  if (card.includes("+")) {
    card.split("+").forEach((c) => removeFromHand(c, gameState));
    return;
  }

  console.log(`Card: ${card}`);
  let index = gameState.playerHand.indexOf(card);

  if (index === -1) {
    throw new Error(`Tried to remove card not in hand: ${card}`);
  }

  gameState.playerHand.splice(index, 1);

  if (gameState.playerDeck.length > 0) {
    gameState.playerHand.push(gameState.playerDeck.pop());
  }
};

const removeFromTower = (gameState) => {
  gameState.tower.pop();
};

/**
 * Discards the enemy's upcard, replacing it with a new card if possible.
 * @param {stateObj} gameState The gameState object.
 */
const replaceEnemyCard = (gameState) => {
  if (gameState.enemyDeck.length > 0) {
    gameState.enemyCard = gameState.enemyDeck.pop();
  }
};

/**
 * Performs a player action using player's card and the current gameState object.
 * If the action is valid, directly mutates the gameState object.
 * If the action is invalid, returns an informative console.log.
 * @param {actionObj} action - The action object, e.g. {type: 'BUILD', cards: ['2D', KH']
 * @param {string} card - The two-character card descriptor, e.g., 'TH', '8S'
 * @param {stateObj} gameState - The gameState object containing playerDeck, enemyCard, etc.
 */
export const doAction = (action, card, gameState) => {
  switch (action.type) {
    case "BUILD": {
      if (getValue(card) <= getValue(gameState.tower.at(-1))) {
        console.log(`Cannot build ${card} - tower must be ascending!`);
      } else {
        console.log(`Built card ${card}`);
        removeFromHand(card, gameState);
        gameState.tower.push(card);
      }
      break;
    }

    case "SWAP": {
      let swappableCards = action.cards;

      if (!swappableCards || !swappableCards.includes(card)) {
        console.log("Could not swap this card!");
      } else {
        console.log(`Swapped card ${card}.`);
        removeFromHand(card, gameState);
        gameState.enemyDeck.unshift(card);
      }
      break;
    }

    case "KILL": {
      let topTower = gameState.tower.at(-1);
      let eligibleCards = action.cards;

      if (!eligibleCards || !eligibleCards.includes(card)) {
        console.log(`Could not kill enemy ${gameState.enemyCard} with ${card}`);
      } else {
        console.log(`Killed enemy ${gameState.enemyCard} with ${card}.`);

        if (card === topTower) {
          removeFromTower(gameState);
        } else {
          removeFromHand(card, gameState);
        }

        replaceEnemyCard(gameState);
      }
      break;
    }

    case "DRAW": {
      const newCard = gameState.playerDeck.pop();
      const bonus = Math.floor(gameState.tower.length / 2);
      if (
        getValue(newCard) + bonus >= getValue(gameState.enemyCard) &&
        getColor(newCard) === getColor(gameState.enemyCard)
      ) {
        replaceEnemyCard(gameState);
        console.log(`SUCCESS! Beat enemy card with ${newCard}`);
      } else {
        if (gameState.tower.length > 1) {
          removeFromTower(gameState);
        }
        console.log(`FAILURE! ${newCard} discarded.`);
      }

      break;
    }

    case "NUKE": {
      if (gameState.tower.length <= 0) {
        throw new Error("Attempted nuke, but no tower found!");
      }
      gameState.tower = [];
      replaceEnemyCard(gameState);
      console.log("Nuked the tower!");
      break;
    }

    default: {
      throw new Error("Invalid action specified! " + action.type);
    }
  }
};

/**
 * Returns a set of actions that the player is allowed to perform, given the gameState.
 * @param {stateObj} gameState The gameState object
 * @returns {Set<actionObj>} Set of action objects { type: 'KILL', cards: [] }. For simple actions like DRAW, the cards array is empty.
 * For complex actions like KILL, this is a two-item array, e.g., ['KILL', ['9S', 'KC']]
 */
export const getActions = (gameState) => {
  let actions = new Set();

  if (!gameState.enemyCard) {
    // Perhaps we could throw an error here
    return actions;
  }

  if (gameState.playerDeck.length > 0) {
    actions.add({ type: "DRAW", cards: [] });
  }

  const towerSize = gameState.tower.length;
  const bonus = Math.floor(towerSize / 2);

  if (towerSize > 0) {
    const buildableCards = gameState.playerHand.filter(
      (card) => getValue(card) > getValue(gameState.tower.at(-1)),
    );

    // console.log(`Buildable cards: ${buildableCards}`);

    if (buildableCards.length > 0) {
      actions.add({ type: "BUILD", cards: buildableCards });
    }
  }

  const enemyColor = getColor(gameState.enemyCard);
  const enemyValue = getValue(gameState.enemyCard);

  const eligibleCards = gameState.playerHand.filter(
    (card) =>
      getColor(card) === enemyColor && getValue(card) + bonus >= enemyValue,
  );

  let topTower = gameState.tower.at(-1);

  if (
    towerSize > 1 &&
    getColor(topTower) === enemyColor &&
    getValue(topTower) >= enemyValue
  ) {
    eligibleCards.push(topTower);
  }

  // Card combo functionality
  // Diff describes cards that cannot beat the enemyCard on their own
  const diff = gameState.playerHand.filter(
    (card) => !eligibleCards.includes(card) && getColor(card) === enemyColor,
  );

  // Reduce each combo to its value & return array of eligible combos in form [card, card, ...]
  const combos = getCombos(diff).filter((combo) => {
    const total = combo.reduce((sum, card) => sum + getValue(card), 0) + bonus;
    return total >= enemyValue;
  });

  const stringifiedCombos = combos.map((c) => c.join("+"));

  const killOptions = eligibleCards.concat(stringifiedCombos);
  console.log(`Kill options: ${killOptions}`);

  if (killOptions.length > 0) {
    actions.add({ type: "KILL", cards: killOptions });
  }

  if (towerSize > 0) {
    actions.add({ type: "NUKE", cards: [] });
  }

  if (gameState.playerDeck.length > 0) {
    actions.add({ type: "SWAP", cards: [...gameState.playerHand] });
  }

  return actions;
};
