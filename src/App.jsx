import { render } from "preact";
import { useState } from "preact/hooks";
import { setupGame } from "./engine/game";

import PlayableCard from "./components/PlayableCard";
import DisplayCard from "./components/DisplayCard";

import "./style.css";
import { getActions } from "./engine/action";

export function App() {
  // gso = Game state object

  const [gameState, setGameState] = useState(setupGame());

  // () => new Set() is a lazy initializer. Used to avoid creating a new Set on every render.
  const [selectedCards, setSelectedCards] = useState(() => new Set());

  /**
   * Store cards that have been multi-selected
   * @param {string} cardString
   */
  const toggleSelected = (cardString) => {
    // Pass our setter an updater function
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardString)) {
        next.delete(cardString);
      } else {
        next.add(cardString);
      }
      return next;
    });
  };

  console.log(getActions(gameState));

  return (
    <div class="flex flex-col h-full justify-between">
      <div id="board" class="flex justify-center gap-4 h-[200px]">
        <DisplayCard
          key={gameState.enemyCard}
          faceUp={true}
          cardString={gameState.enemyCard}
          selectedCards={selectedCards}
          gameState={gameState}
          action="KILL"
        />
        <DisplayCard
          key={"enemyDeckDummy"}
          faceUp={false}
          selectedCards={selectedCards}
          gameState={gameState}
          action="SWAP"
        />
      </div>

      <div id="hotbar" class="flex gap-4 h-[200px]">
        <div id="tower" class="flex flex-none flex-col">
          <DisplayCard
            key={"towerDummy"}
            faceUp={true}
            cardString="AS"
            selectedCards={selectedCards}
            gameState={gameState}
            action="BUILD"
          />
        </div>

        <div
          id="playerHand"
          class="flex flex-1 flex-row justify-center gap-2 bg-sky-500"
        >
          {gameState.playerHand.map((card) => (
            <PlayableCard
              key={card}
              faceUp={true}
              cardString={card}
              selected={selectedCards.has(card)}
              onToggle={toggleSelected}
            />
          ))}
        </div>

        <div id="playerDeck" class="flex flex-none flex-col">
          {/* {gameState.playerDeck.map((card) => (
            <Card key={card} cardString={card} playable={false} down={true} />
          ))} */}
          <DisplayCard
            key={"playerDeckDummy"}
            faceUp={false}
            selectedCards={selectedCards}
            gameState={gameState}
            action="DRAW"
          />
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));

// ON CARD CLICK:
//   selections.push(card)
//   showActions(selections) -> highlights each possible play with border

//   ===

//   KILL:
//     animate card(s) -> position(upcard)
//     *animate moving both to discard pile
//     animate drawing new card(s)

//   SWAP:
//     animate card -> position(enemyDeck)
//     animate drawing new card

//   BUILD:
//     *animate card -> position(tower)
//     animate drawing new card

//   NUKE:
//     animate destroying tower

//   DRAW:
//     *animate drawing 6th card -> new position (absolute, middle of screen?)
//     animate card -> position(upcard)
