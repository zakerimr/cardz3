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
 * Object describing a combination of playable cards, e.g. { singles: [...], combos: [[...], [...]] }
 * @typedef {object | null} optionSet
 * @property {Array<string>} singles - Array describing a single-card option, e.g. ['JH', 'KH']
 * @property {Array<Array<string>>} combos - Array describing combo options, e.g. [['2D', '3D'], ['AS', 'KC']]
 */

/**
 * Object describing an action and its playable card set.
 * @typedef {object} actionObj
 * @property {"BUILD" | "SWAP" | "KILL" | "DRAW" | "NUKE"} type - Type of action.
 * @property {optionSet} opts - Object describing the combination of playable cards (singles & combos).
 */

export {};
