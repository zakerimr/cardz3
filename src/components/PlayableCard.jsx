import { getImgFromCardString } from "../ui/util";

export default function PlayableCard({
  cardString,
  faceUp,
  selected,
  onToggle,
}) {
  return (
    <img
      src={getImgFromCardString(faceUp, cardString)}
      onClick={() => onToggle(cardString)}
      class={
        "cursor-pointer rounded-lg shadow-md " +
        (selected ? "outline-3 outline-red-500 " : "")
      }
    >
      {cardString}
    </img>
  );
}
