import { useContext } from "preact/hooks";
import { getImgFromCardString } from "../ui/util";
import { GameContext } from "../ui/GameContext";
import { getActions } from "../engine/action";

export default function DisplayCard({ faceUp, cardString = "", action }) {
  const { state, dispatch } = useContext(GameContext);

  const selectedCards = state.selectedCards;

  const handleClick = () => {
    if (selectedCards.size === 0) return;

    const actions = [...getActions(state)];
    const relevantAction = actions.find((a) => a.type === action);
    if (!relevantAction) return;

    dispatch({
      type: "PERFORM_ACTION",
      payload: { gameAction: relevantAction, selectedCards },
    });
  };

  return (
    <img
      src={getImgFromCardString(faceUp, cardString)}
      onClick={handleClick}
      class="rounded-lg h-full shadow-md cursor-pointer relative"
    />
  );
}
