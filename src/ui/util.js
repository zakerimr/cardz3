/**
 * @param {boolean} faceUp
 * @param {string} cardString
 */
export function getImgFromCardString(faceUp, cardString) {
  return faceUp ? `/faces/${cardString[0]}${cardString[1]}.svg` : "/Back.svg";
}
