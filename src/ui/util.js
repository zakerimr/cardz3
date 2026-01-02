/**
 * Get the image path corresponding to a card string.
 * @param {boolean} faceUp - Whether or not the card is face-up
 * @param {string} cardString - The two-character card descriptor.
 * @returns {string} - Filepath to card image
 */
export function getImgFromCardString(faceUp, cardString) {
  return faceUp ? `/faces/${cardString[0]}${cardString[1]}.svg` : "/Back.svg";
}
