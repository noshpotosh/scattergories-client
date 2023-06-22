import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import '../style/GameOver.css';


const GameOver = (props) => {
    const navigate = useNavigate();
    const [gameOutcome, setGameOutcome] = useState("");

    useEffect(() => {
        if (props.playerOneTotalScore > props.playerTwoTotalScore) {
            setGameOutcome("You win!");
        } else if (props.playerOneTotalScore < props.playerTwoTotalScore) {
            setGameOutcome("You lose!");
        } else {
            setGameOutcome("It's a tie!");
        }
    }, []);

    const exitGameRoom = () => {
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="game-over-container">
            <h1 className="game-over">Game Over</h1>
            <div className="game-summary">
                <h2 className="your-total-score">Your total score: {props.playerOneTotalScore}</h2>
                <h2 className="opponent-total-score">Opponent's total score: {props.playerTwoTotalScore}</h2>
                <h2 className="game-outcome">{gameOutcome}</h2>
            </div>
            <button className="exit-game" onClick={exitGameRoom}>Exit</button>
        </div>
    );
};

export default GameOver;