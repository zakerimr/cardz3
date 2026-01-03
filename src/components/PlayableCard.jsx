import { useContext, useEffect, useState } from "preact/hooks";
import { getImgFromCardString } from "../ui/util";
import { GameContext } from "../ui/GameContext";

import "../style.css";

export default function PlayableCard({ cardString }) {
  const { state, dispatch } = useContext(GameContext);

  const selectedCards = state.selectedCards;
  const isSelected = selectedCards.has(cardString);

  // Local state for animation
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if this card is currently animating
  useEffect(() => {
    const anim = state.animations.find(
      (a) => a.type === "KILL" && a.cards.includes(cardString),
    );
    if (anim) setIsAnimating(true);
  }, [state.animations, cardString]);

  // Remove animation after it ends
  const handleAnimationEnd = () => {
    setIsAnimating(false);

    // Clear animations from global state after a short delay
    setTimeout(() => dispatch({ type: "CLEAR_ANIMATIONS" }), 0);
  };

  const handleClick = () => {
    dispatch({ type: "TOGGLE_SELECT", payload: cardString });
  };

  return (
    <img
      src={getImgFromCardString(true, cardString)}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      class={
        "rounded-lg h-full shadow-md cursor-pointer " +
        (isSelected ? "outline-3 outline-blue-500" : "") +
        (isAnimating
          ? " animate-hand-to-enemy transition-transform duration-700 ease-in-out"
          : "")
      }
    />
  );
}
