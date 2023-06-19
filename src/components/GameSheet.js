import { React, useContext, useEffect, useState } from "react";

import { GameManagerContext } from '../context/GameManagerContext';

import '../style/GameSheet.css';

const GameSheet = (props) => {
    const gameManager = useContext(GameManagerContext);
    const [playerOneAnswers] = useState(gameManager.playerOneSubmittedEvent);
    const [playerTwoAnswers] = useState(gameManager.playerTwoSubmittedEvent);

    const [isPlayerOneResults] = useState(props.isPlayerOneResults);
    const [canBeDisputed] = useState(props.canBeDisputed);
    const [answers, setAnswers] = useState(["", "", "", "", "", "", "", "", "", "", "", ""]);
    const [disputes, setDisputes] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);

    // Game sheet functions
    useEffect(() => {
        if (props.isTimeUp) {
            submitAnswers();
        }

    }, [props.isTimeUp]);

    const handleNewAnswer = (event) => {
        const newAnswers = [...answers];

        for (let i = 0; i < newAnswers.length; i++) {
            if (event.target.id === "answer" + i) {
                newAnswers[i] = event.target.value;
                setAnswers(newAnswers);
            }
        }
    }

    const getRoundString = () => {
        if (props.currentRound === 1) {
            return "One";
        }

        if (props.currentRound === 2) {
            return "Two";
        }

        if (props.currentRound === 3) {
            return "Three";
        }
    }

    const submitAnswers = () => {
        gameManager.sendEventMessage("AnswersSubmittedEvent", answers);
        props.setShowRoundResults(true);
    }
    
    // Score sheet functions
    useEffect(() => {
        // Prevent populating answers during round
        if (canBeDisputed) {
            populateAnswers();
        }
    }, []);

    useEffect(() => {
        // Prevent calculating score during round
        if (!canBeDisputed) {
            return;
        }

        var currentScore = 0;
        const newDisputes = [...disputes];

        for (let i = 0; i < answers.length; i++) {
            if (isSameAnswerAsOpponent(answers[i]) || answers[i].charAt(0).toLowerCase() != props.roundLetter.toLowerCase()) {
                // Answer does not have the correct letter or is the same as an answer from player two. Automatically disputed
                newDisputes[i] = true;
            } else {
                var splitAnswer = answers[i].split(" ");
                // Set answer as not disputed
                newDisputes[i] = false;
                
                if (splitAnswer.length > 1 && splitAnswer[0].charAt(0).toLowerCase() === splitAnswer[1].charAt(0).toLowerCase()) {
                    currentScore = currentScore + 2;
                } else {
                    currentScore++;
                }
            }
        }

        setDisputes(newDisputes);
        props.setScore(currentScore);
    }, [answers]);

    const populateAnswers = () => {
        if (isPlayerOneResults) {
            setAnswers(playerOneAnswers);
        } else {
            setAnswers(playerTwoAnswers);
        }

    }

    const handleNewDispute = (event) => {
        // Prevent disputing answers during round
        if (!canBeDisputed) {
            return;
        }


        const newDisputes = [...disputes];
        const currentCheckBoxIndex = event.target.id.split("dispute")[1];
        const currentCheckBoxAnswer = answers[currentCheckBoxIndex].split(" ");

        // Empty answer, cannot be disputed
        if (currentCheckBoxAnswer[0] === "") {
            return;
        }

        // Answer does not have the correct letter (not calculated in score), so cannot be disputed or undisputed
        if (currentCheckBoxAnswer[0].charAt(0).toLowerCase() != props.roundLetter.toLowerCase()) {
            return;
        }

        if (isSameAnswerAsOpponent(answers[currentCheckBoxIndex])) {
            return;
        }

        newDisputes[currentCheckBoxIndex] = !newDisputes[currentCheckBoxIndex];
        setDisputes(newDisputes);

        if (newDisputes[currentCheckBoxIndex]) {
            // Two words with the same letter, double points
            if (currentCheckBoxAnswer.length > 1 && currentCheckBoxAnswer[0].charAt(0).toLowerCase() === currentCheckBoxAnswer[1].charAt(0).toLowerCase()) {
                props.setScore(props.score - 2);
            } else {
                props.setScore(props.score - 1);
            }
        } else if (!newDisputes[currentCheckBoxIndex]) {
            // Two words with the same letter, double points
            if (currentCheckBoxAnswer.length > 1 && currentCheckBoxAnswer[0].charAt(0).toLowerCase() === currentCheckBoxAnswer[1].charAt(0).toLowerCase()) {
                props.setScore(props.score + 2);
            } else {
                props.setScore(props.score + 1);
            }
        }
    }

    const isSameAnswerAsOpponent = (answerToCheck) => {
        for (let i = 0; i < playerTwoAnswers.length; i++) {
            if (isPlayerOneResults) {
                if (answerToCheck.toLowerCase() === playerTwoAnswers[i].toLowerCase()) {
                    return true;
                }
            } else {
                if (answerToCheck.toLowerCase() === playerOneAnswers[i].toLowerCase()) {
                    return true;
                }
            }
        }

        return false;
    };

    return (
        <div className="game-sheet">
            <form className="sheet-form">
                <img className="sheet-logo" src="https://play-lh.googleusercontent.com/fdg7CSbIxPIFbL9SHfgJpmZgVHXtPZFhidOCvHwIJYzzHJc19xY93FXQzW6wdwGyLpc"></img>
                {!canBeDisputed ? <h4 className="round-number">{getRoundString()}</h4> : null}
                {canBeDisputed ? <h4 className="sheet-owner">{isPlayerOneResults ? "Your answers" : "Opponent's answers"}</h4> : null}
                {canBeDisputed ? <h4 className="sheet-score">Score: {props.score}</h4> : null}
                <ol>
                    <li id="dispute0" onClick={handleNewDispute}>
                        <textarea id="answer0" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[0]} value={answers[0]} onChange={handleNewAnswer}/>
                    </li>
                    <li id="dispute1" onClick={handleNewDispute}>
                        <textarea id="answer1" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[1]} value={answers[1]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute2" onClick={handleNewDispute}>
                        <textarea id="answer2" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[2]} value={answers[2]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute3" onClick={handleNewDispute}>
                        <textarea id="answer3" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[3]} value={answers[3]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute4" onClick={handleNewDispute}>
                        <textarea id="answer4" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[4]} value={answers[4]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute5" onClick={handleNewDispute}>
                        <textarea id="answer5" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[5]} value={answers[5]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute6" onClick={handleNewDispute}>
                        <textarea id="answer6" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[6]} value={answers[6]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute7" onClick={handleNewDispute}>
                        <textarea id="answer7" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[7]} value={answers[7]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute8" onClick={handleNewDispute}>
                        <textarea id="answer8" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[8]} value={answers[8]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute9" onClick={handleNewDispute}>
                        <textarea id="answer9" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[9]} value={answers[9]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute10" onClick={handleNewDispute}>
                        <textarea id="answer10" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[10]} value={answers[10]} onChange={handleNewAnswer} />
                    </li>
                    <li id="dispute11" onClick={handleNewDispute}>
                        <textarea id="answer11" className={"answer " + "uneditable-" + canBeDisputed + " disputed-" + disputes[11]} value={answers[11]} onChange={handleNewAnswer} />
                    </li>
                </ol>
            </form>
        </div>
    );
};

export default GameSheet;