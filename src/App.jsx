import { render } from "preact";
import { useReducer } from "preact/hooks";
import { setupGame } from "./engine/game";
import { GameContext } from "./ui/GameContext";
import { gameReducer } from "./engine/gameReducer";

import PlayableCard from "./components/PlayableCard";
import DisplayCard from "./components/DisplayCard";

import "./style.css";

export function App() {
  const initialGameState = setupGame();
  initialGameState.selectedCards = new Set();
  initialGameState.animations = [];

  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div class="flex flex-col h-full justify-between">
        <div id="board" class="flex justify-center gap-4 h-[200px]">
          <DisplayCard faceUp cardString={state.enemyCard} action="KILL" />
          <div class="relative">
            <DisplayCard faceUp={false} action="SWAP" />
            <span class="absolute top-0 right-0 bg-black text-white rounded-full px-2">
              {state.enemyDeck.length}
            </span>
          </div>
        </div>

        <div id="hotbar" class="flex gap-4 h-[200px]">
          <div id="tower" class="flex flex-none flex-col">
            <DisplayCard faceUp cardString="AS" action="BUILD" />
          </div>

          <div
            id="playerHand"
            class="flex flex-1 flex-row justify-center gap-2"
          >
            {state.playerHand.map((card) => (
              <PlayableCard key={card} cardString={card} />
            ))}
          </div>

          <div id="playerDeck" class="flex flex-none flex-col items-center">
            <DisplayCard faceUp={false} action="DRAW" />
            <span class="mt-1 text-black font-bold">
              {state.playerDeck.length}
            </span>
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
}

render(<App />, document.getElementById("app"));
