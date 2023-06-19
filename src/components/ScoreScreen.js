import { useContext, useEffect, useState } from "react";

import { GameManagerContext } from '../context/GameManagerContext';
import GameSheet from "./GameSheet";

import '../style/ScoreScreen.css';

const ScoreScreen = (props) => {
    const gameManager = useContext(GameManagerContext);
    const [playerOneScore, setPlayerOneScore] = useState(0);
    const [playerTwoScore, setPlayerTwoScore] = useState(0);
    const [messagesRecieved, setMessagesRecieved] = useState(0);
    const [infoMessage, setInfoMessage] = useState("Placeholder");

    const startNextRound = () => {
        gameManager.sendEventMessage("ScoreSubmittedEvent", playerOneScore + ":" + playerTwoScore);
    };

    useEffect(() => {
        if (!gameManager.playerOneSubmittedEvent && !gameManager.playerTwoSubmittedEvent) {
            return;
        }

        setMessagesRecieved(messagesRecieved + 1);
    }, [gameManager.playerOneSubmittedEvent, gameManager.playerTwoSubmittedEvent]);

    useEffect(() => {
        if (!gameManager.playerOneScoreEvent && !gameManager.playerTwoScoreEvent) {
            return;
        }

        if (!gameManager.playerOneScoreEvent) {
            return;
        }

        // If only one score submitted, wait.
        if (!gameManager.playerTwoScoreEvent) {
            setInfoMessage("Waiting for opponent's score sheet to be submitted...");
            return;
        }

        // If both scores submitted, check that scores are equal. Have to reverse the scores to make sure they are the same.
        if (gameManager.playerOneScoreEvent != gameManager.playerTwoScoreEvent.split("").reverse().join("")) {
            setInfoMessage("Submitted score sheets are not equal. Please coordinate your scoring and resubmit.");
            return;
        }

        // Scores are equal, start next round.
        props.setPlayerOneTotalScore(props.playerOneTotalScore + playerOneScore);
        props.setPlayerTwoTotalScore(props.playerTwoTotalScore + playerTwoScore);
        props.startRound();

    }, [gameManager.playerOneScoreEvent, gameManager.playerTwoScoreEvent]);

    return (
        <div>
            {messagesRecieved == 2 ? 
                <div className="score-screen">
                    <div className="round-info">
                        <h2 className="round-topic">Topic: {props.topic}</h2> 
                        <h3 className="round-letter">Letter: {props.letter}</h3>
                    </div>

                    <GameSheet 
                        score={playerOneScore} 
                        setScore={setPlayerOneScore} 
                        isPlayerOneResults={true} 
                        canBeDisputed={true} 
                        roundLetter={props.letter} />
                    <GameSheet 
                        score={playerTwoScore}
                        setScore={setPlayerTwoScore} 
                        isPlayerOneResults={false} 
                        canBeDisputed={true} 
                        roundLetter={props.letter} />
                    
                    <button className="start-round" onClick={startNextRound}>{props.currentRoundNumber < 4 ? "Start Next Round" : "See Game Results"}</button>
                    <p className={"info-message showMessage-" + (infoMessage != "Placeholder")}>{infoMessage}</p>
                </div> 
                : 
                null 
            }
    </div>
        
    );
};

export default ScoreScreen;