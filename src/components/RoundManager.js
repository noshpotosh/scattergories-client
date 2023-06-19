import { React } from "react";

import GameSheet from "./GameSheet";
import Timer from './Timer.js';

import '../style/RoundManager.css';

const RoundManager = (props) => {

    return (
        <div className="round-container">
            <div className="round-info">
                <h2 className="round-topic">Topic: {props.topic}</h2> 
                <h2 className="round-letter">Letter: {props.letter}</h2>
            </div>
            <Timer setIsTimeUp={props.setIsTimeUp} />
            <GameSheet 
                isDispute={false} 
                currentRound={props.currentRound}
                isTimeUp={props.isTimeUp} 
                setShowRoundResults={props.setShowRoundResults} />
        </div> 
    );
};

export default RoundManager;