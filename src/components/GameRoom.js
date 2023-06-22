import { useContext, useEffect, useState } from "react";

import { GameManagerContext } from '../context/GameManagerContext';
import Topics from "../files/Categories.json";
import GameOver from "./GameOver";
import RoundManager from "./RoundManager";
import ScoreScreen from "./ScoreScreen";

import '../style/GameRoom.css';

function GameRoom() {
    const gameManager = useContext(GameManagerContext);
    const [secondPlayerConnected, setSecondPlayerConnected] = useState(false);

    const [playerOneTotalScore, setPlayerOneTotalScore] = useState(0);
    const [playerTwoTotalScore, setPlayerTwoTotalScore] = useState(0);

    const [topics] = useState(Topics);
    const [topic, setTopic] = useState("");
    const [letter, setLetter] = useState("");

    const [currentRoundNumber, setNumberOfRoundsPlayed] = useState(1);   
    const [showGameElements, setShowGameElements] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [showRoundResults, setShowRoundResults] = useState(false);

    const isRoundstarted = showGameElements;
    const isFirstRound = currentRoundNumber === 1;
    const gameOver = currentRoundNumber > 3 && !showRoundResults;

    useEffect(() => {
        // Prevent setting second player connected on first render
        if (gameManager.secondPlayerConnectedEvent === null) {
            return;
        }

        setSecondPlayerConnected(true);
    }, [gameManager.secondPlayerConnectedEvent]);

    useEffect(() => {
        // Prevent setting round started on first render
        if (gameManager.roundStartedEvent === null) {
            return;
        }
        setTopic(gameManager.roundStartedEvent.split(":")[0]);
        setLetter(gameManager.roundStartedEvent.split(":")[1]);

        // Reset display booleans for new round started
        setShowRoundResults(false);
        setIsTimeUp(false);
        setShowGameElements(true);
    }, [gameManager.roundStartedEvent]);

    useEffect(() => {
        if (isTimeUp) {
            setNumberOfRoundsPlayed(currentRoundNumber + 1);
        }
    }, [isTimeUp]);

    const getRandomTopic = () => {
        var max = topics.Categories.length;
        var min = 0;

        return topics.Categories.at(Math.random() * (max - min) + min);
    };

    const getRandomTopicLetter = () => {
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    };

    const startRound = () => {
        var ROUND_STARTED_MESSAGE = getRandomTopic() + ":" + getRandomTopicLetter();
        
        gameManager.sendEventMessage("RoundStartedEvent", ROUND_STARTED_MESSAGE);
    };

    return (
        <div className="GameRoom-body">
            { !secondPlayerConnected ? <h1 className="room-name">Room: {gameManager.roomId}</h1> : null }
            
            {!secondPlayerConnected ? <p className="waiting-message">Waiting for another player to connect...</p> : null}

            { secondPlayerConnected && isFirstRound && !isRoundstarted ? <button className="start-game" onClick={startRound}>Start Game</button> : null }

            { isRoundstarted && !showRoundResults && !gameOver ? 
                <RoundManager 
                    isTimeUp={isTimeUp} 
                    setIsTimeUp={setIsTimeUp} 
                    showGameElements={showGameElements} 
                    setShowRoundResults={setShowRoundResults} 
                    currentRound={currentRoundNumber}
                    topic={topic}
                    letter={letter} />
                : 
                null 
            }
            
            { showRoundResults ? 
                <ScoreScreen 
                    currentRoundNumber={currentRoundNumber} 
                    topic={topic}
                    letter={letter} 
                    startRound={startRound}
                    playerOneTotalScore={playerOneTotalScore} 
                    playerTwoTotalScore={playerTwoTotalScore} 
                    setPlayerOneTotalScore={setPlayerOneTotalScore} 
                    setPlayerTwoTotalScore={setPlayerTwoTotalScore} /> 
                : 
                null 
            }

            { gameOver ? <GameOver playerOneTotalScore={playerOneTotalScore} playerTwoTotalScore={playerTwoTotalScore} /> : null }
        </div>
  );
};

export default GameRoom;