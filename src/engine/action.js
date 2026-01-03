/**
 * @file action.js - Manages the player actions, determining which actions they can play and their implementations.
 * All game actions mutate gameState in place by design.
 */

import { getValue, getColor, getCombos } from "./util.js";

/** @import {stateObj, actionObj, optionSet} from "./typedefs.js"*/

/**
 * Removes card(s) from the player's hand and draws replacements if possible.
 * Supports additive cards like "2H+3H".
 * @param {string} card
 * @param {stateObj} state
 * @returns {stateObj}
 */
export const removeFromHand = (card, state) => {
  let next = structuredClone(state);

  const cardsToRemove = card.includes("+") ? card.split("+") : [card];

  for (const c of cardsToRemove) {
    const index = next.playerHand.indexOf(c);

    if (index === -1) {
      throw new Error(`Tried to remove card not in hand: ${c}`);
    }

    next.playerHand.splice(index, 1);

    if (next.playerDeck.length > 0) {
      next.playerHand.push(next.playerDeck.pop());
    }
  }

  return next;
};

/**
 * Removes the topmost card from the player's tower.
 * @param {stateObj} state
 * @returns {stateObj}
 */
export const removeFromTower = (state) => {
  if (state.tower.length === 0) return state;

  const next = structuredClone(state);
  next.tower.pop();
  return next;
};

/**
 * Discards the enemy upcard and replaces it if possible.
 * @param {stateObj} state
 * @returns {stateObj}
 */
export const replaceEnemyCard = (state) => {
  if (state.enemyDeck.length === 0) return state;

  const next = structuredClone(state);
  next.enemyCard = next.enemyDeck.pop();
  return next;
};

/**
 * Performs a player action using player's card and the current gameState object.
 * If the action is valid, directly mutates the gameState object.
 * If the action is invalid, returns an informative console.log.
 * @param {actionObj} action - The action object, e.g. {type: 'BUILD', cards: ['2D', KH']
 * @param {Array<string>} cards - Array of two-character card descriptor, e.g., ['TH', '8S']
 * @param {stateObj} gameState - The gameState object containing playerDeck, enemyCard, etc.
 */

export const doAction = (action, cards, gameState) => {
  // Clone once at the reducer boundary
  let state = structuredClone(gameState);

  const { singles = [], combos = [] } = action.opts ?? {};
  const isCombo = cards.length > 1;

  switch (action.type) {
    case "BUILD": {
      if (isCombo) return state;

      const card = cards[0];
      if (!singles.includes(card)) return state;

      state = removeFromHand(card, state);
      state.tower.push(card);

      return state;
    }

    case "SWAP": {
      if (isCombo) return state;

      const card = cards[0];
      if (!singles.includes(card)) return state;

      state = removeFromHand(card, state);
      state.enemyDeck.unshift(card);

      return state;
    }

    case "KILL": {
      const topTower = state.tower.at(-1);

      // ----- Single-card kill -----
      if (!isCombo) {
        const card = cards[0];
        if (!singles.includes(card)) return state;

        if (card === topTower) {
          state = removeFromTower(state);
        } else {
          state = removeFromHand(card, state);
        }

        state = replaceEnemyCard(state);
        return state;
      }

      // ----- Combo kill -----
      const validCombo = combos.some(
        (combo) =>
          combo.length === cards.length &&
          combo.every((c) => cards.includes(c)),
      );

      if (!validCombo) return state;

      for (const card of cards) {
        state = removeFromHand(card, state);
      }

      state = replaceEnemyCard(state);
      return state;
    }

    case "DRAW": {
      if (state.playerDeck.length === 0) return state;

      const newCard = state.playerDeck.pop();
      const bonus = Math.floor(state.tower.length / 2);

      if (
        getValue(newCard) + bonus >= getValue(state.enemyCard) &&
        getColor(newCard) === getColor(state.enemyCard)
      ) {
        state = replaceEnemyCard(state);
      } else if (state.tower.length > 1) {
        state = removeFromTower(state);
      }

      return state;
    }

    case "NUKE": {
      if (state.tower.length === 0) return state;

      state.tower = [];
      state = replaceEnemyCard(state);

      return state;
    }

    default:
      return state;
  }
};

/**
 * Returns a set of actions that the player is allowed to perform, given the gameState.
 * @param {stateObj} gameState The gameState object
 * @returns {Set<actionObj>} Set of action objects { type: 'KILL', cards: [] }. For simple actions like DRAW, the cards array is empty.
 * For complex actions like KILL, this is a two-item array, e.g., ['KILL', ['9S', 'KC']]
 */
export const getActions = (gameState) => {
  /** @type {Array<actionObj>} */
  let actions = new Set();

  if (!gameState.enemyCard) {
    return actions;
  }

  if (gameState.playerDeck.length > 0) {
    actions.add({ type: "DRAW", opts: null });
  }

  const towerSize = gameState.tower.length;
  const bonus = Math.floor(towerSize / 2);

  if (towerSize > 0) {
    const buildableCards = gameState.playerHand.filter(
      (card) => getValue(card) > getValue(gameState.tower.at(-1)),
    );

    if (buildableCards.length > 0) {
      actions.add({
        type: "BUILD",
        opts: { singles: buildableCards, combos: [] },
      });
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

  /** @type {optionSet} */
  const killOptions = { singles: eligibleCards, combos: combos };

  if (eligibleCards.length > 0 || combos.length > 0) {
    actions.add({ type: "KILL", opts: killOptions });
  }

  if (towerSize > 0) {
    actions.add({ type: "NUKE", opts: null });
  }

  if (gameState.playerDeck.length > 0) {
    /** @type {optionSet} */
    const swappableCards = { singles: [...gameState.playerHand], combos: [] };

    actions.add({
      type: "SWAP",
      opts: swappableCards,
    });
  }

  return actions;
};
