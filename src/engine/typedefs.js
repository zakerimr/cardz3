/**
 * @file typedefs.js - Defines custom types.
 */

/**
 * Object describing the current state of the game.
 * @typedef {object} stateObj
 * @property {Array<string>} playerDeck - Cards in the player's deck (25).
 * @property {Array<string>} playerHand - Cards in the player's hand (5).
 * @property {Array<string>} enemyDeck - Cards in the enemy's hand (20).
 * @property {string} enemyCard - Enemy's current upcard.
 * @property {Array<string>} tower - Cards in the player's tower.
 */

/**
 * Object describing an action and its playable card set.
 * @typedef {object} actionObj
 * @property {"BUILD" | "SWAP" | "KILL" | "DRAW" | "NUKE"} type - Type of action.
 * @property {Array<string>} cards - The cards in the player's hand eligible to be performed with the action.
 */

export {};
