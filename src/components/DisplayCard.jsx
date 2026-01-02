import { getImgFromCardString } from "../ui/util";
import { doAction, getActions } from "../engine/action";

export default function DisplayCard({
  faceUp,
  selectedCards,
  action,
  gameState,
  cardString = "",
}) {
  const hasSelectedCards = selectedCards.size > 0;

  const handleClick = () => {
    if (hasSelectedCards) {
      const actions = [...getActions(gameState)];

      const relevantAction = actions.find((a) => a.type === action);

      console.log("relevant action: ", relevantAction);

      if (relevantAction) {
        doAction(
          { type: action, cards: relevantAction.cards },
          cardString,
          gameState,
        );
      }
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
