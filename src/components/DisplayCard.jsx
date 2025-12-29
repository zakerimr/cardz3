import { useState } from "preact/hooks";

import { getImgFromCardString } from "../ui/util";

export default function DisplayCard({
  faceUp,
  selectedCards,
  action,
  cardString = "",
}) {
  const hasSelectedCards = selectedCards.size > 0;

  const handleClick = () => {
    if (hasSelectedCards) {
      console.log(action);
    }
  };

  return (
    <img
      src={getImgFromCardString(faceUp, cardString)}
      onClick={handleClick}
      class={
        "rounded-lg h-full shadow-md " +
        (hasSelectedCards ? "cursor-pointer " : "")
      }
    >
      {cardString}
    </img>
  );
}
