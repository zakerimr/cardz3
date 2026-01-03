import { doAction } from "./action";

export const initialSelectedCards = new Set();

// gameReducer.js (simplified)
export const gameReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedCards);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, selectedCards: next };
    }

    case "PERFORM_ACTION": {
      const { gameAction, selectedCards } = action.payload;
      let newState = doAction(gameAction, Array.from(selectedCards), state);

      // Add animation if KILL
      if (gameAction.type === "KILL") {
        newState = {
          ...newState,
          animations: [
            ...state.animations,
            {
              type: "KILL",
              cards: Array.from(selectedCards),
              targetCard: state.enemyCard,
            },
          ],
          selectedCards: new Set(),
        };
      } else {
        newState = { ...newState, selectedCards: new Set() };
      }

      return newState;
    }

    case "CLEAR_ANIMATIONS":
      return { ...state, animations: [] };

    default:
      return state;
  }
};
