import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import GameManager from "./components/GameManager.js";
import GameRoom from "./components/GameRoom.js";
import Home from "./components/Home.js";
import { GameManagerContext } from "./context/GameManagerContext.js";

import './App.css';

function App() {
  const gameManager = GameManager();

  return (
    <GameManagerContext.Provider value={gameManager}>
      <Router>
        <Routes>
          <Route exact path="/scattergories-client" element={ <Home/> } />
          <Route exact path="/scattergories-client/:roomId" element={ <GameRoom /> } />
        </Routes>
      </Router>
    </GameManagerContext.Provider>
  );
}

export default App;
