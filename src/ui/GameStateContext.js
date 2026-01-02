import { createContext } from "preact";

// Provides the current game state.
export const GameStateContext = createContext(null);

// Provides the function that lets child components dispatch actions.
export const GameStateDispatchContext = createContext(null);
