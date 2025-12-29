/**
 * @file util.js - Helper functions that require no external dependencies (pure).
 */

/**
 * Gets the value of a card.
 * @param {string} card - The two-character card descriptor.
 * @returns {number} - The integer card value, excluding bonus.
 */
export const getValue = (card) => {
  const rank = card[0];
  let value = 0;
  switch (rank) {
    case "K":
      value = 13;
      break;
    case "Q":
      value = 12;
      break;
    case "J":
      value = 11;
      break;
    case "T":
      value = 10;
      break;
    case "A":
      value = 1;
      break;
    default:
      value = Number(rank);
  }
  return value;
};

/**
 * Gets the color of a card.
 * @param {string} card - The two-character card descriptor.
 * @returns {string} - The color identifier, e.g., "BLACK", "RED"
 */
export const getColor = (card) => {
  const suit = card[1];
  if (suit === "C" || suit === "S") {
    return "BLACK";
  } else if (suit === "D" || suit === "H") {
    return "RED";
  } else {
    throw new Error(`Could not get card color - invalid card (${card})!,`);
  }
};

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * The previous shuffle algorithm was a naïve algorithm, see: https://blog.codinghorror.com/the-danger-of-naivete/
 * @param {Array} arr - The array to be shuffled.
 * @returns {Array} - A copy of the shuffled array.
 */
export const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Gets all subsets of size >= 2 of an array using a backtracking algorithm.
 * For further explanation of the algorithm, see: https://www.geeksforgeeks.org/dsa/backtracking-algorithms/
 * Example trace:
 *  ['9S', '7S', '5S']
 *   ├─ 9S
 *   │   ├─ 7S   → [9S,7S]
 *   │   │   ├─ 5S → [9S,7S,5S]
 *   │   └─ 5S   → [9S,5S]
 *   ├─ 7S
 *   │   └─ 5S   → [7S,5S]
 *   └─ 5S       → (ignored)
 * @param {Array} arr - The array from which to generate all valid combinations.
 * @returns {Array<Array>} - An array of valid combinations.
 */
export const getCombos = (arr) => {
  const results = [];

  const backtrack = (start, combo) => {
    // Solution condition: Any combo of length >= 2 is a valid result
    // We still continue recursion to find longer combos
    if (combo.length >= 2) {
      results.push([...combo]);
    }

    // Try adding each remaining card, beginning at 'start'
    for (let i = start; i < arr.length; i++) {
      // Make choice
      combo.push(arr[i]);

      // Explore further combinations using remaining cards
      backtrack(i + 1, combo);

      // Undo choice (backtrack)
      // Restores combo to its previous state before the next iteration
      combo.pop();
    }
  };

  backtrack(0, []); // Begin recursion with empty combo and index 0

  return results;
};
