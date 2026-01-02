import { getImgFromCardString } from "../ui/util";
import { doAction, getActions } from "../engine/action";

export default function DisplayCard({
  faceUp,
  selectedCards,
  action,
  gameState,
  cardString = "", // cosmetic, do not use in logic
}) {
  const sc = [...selectedCards];

  const handleClick = () => {
    if (sc.length <= 0) return;

    const actions = [...getActions(gameState)];
    const relevantAction = actions.find((a) => a.type === action);

    if (relevantAction) {
      let multiselect = false;
      if (sc.length > 1) multiselect = true;

      doAction(
        { type: action, cards: relevantAction.cards },
        multiselect ? sc.join("+") : sc,
        gameState,
      );
    }
  };

  return (
    <img
      src={getImgFromCardString(faceUp, cardString)}
      onClick={handleClick}
      class={
        "rounded-lg h-full shadow-md " +
        (sc.length > 0 ? "cursor-pointer " : "")
      }
    >
      {cardString}
    </img>
  );
}
