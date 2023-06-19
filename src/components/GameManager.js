import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const GAME_EVENT_MESSAGE = "eventMessage";
const CONNECTION_VALIDATION_MESSAGE = "ConnectionEvent";
const SECOND_PLAYER_CONNECTED_MESSAGE = "SecondPlayerConnectedEvent";
const ROUND_STARTED_MESSAGE = "RoundStartedEvent";
const ANSWERS_SUBMITTED_EVENT = "AnswersSubmittedEvent";
const SCORE_SUBMITTED_EVENT = "ScoreSubmittedEvent";
const SOCKET_SERVER_URL = "https://scattergories-server.onrender.com";

const GameManager = () => {
    const socketRef = useRef();
    const [roomId, setRoomId] = useState(null);
    const [isNewRoom, setIsNewRoom] = useState(null);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const [connectionEvent, setConnectionEvent] = useState(null);
    const [secondPlayerConnectedEvent, setSecondPlayerConnectedEvent] = useState(null);
    const [roundStartedEvent, setRoundStartedEvent] = useState(null);
    const [playerOneSubmittedEvent, setPlayerOneSubmittedEvent] = useState(null);
    const [playerTwoSubmittedEvent, setPlayerTwoSubmittedEvent] = useState(null);
    const [playerOneScoreEvent, setPlayerOneScoreEvent] = useState(null);
    const [playerTwoScoreEvent, setPlayerTwoScoreEvent] = useState(null);


    useEffect(() => {
        // Prevents calling socket connection code before the user has selected a room
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: { roomId, isNewRoom },
        });

        socketRef.current.on(GAME_EVENT_MESSAGE, (message) => {
            const incomingMessage = {
                header: message.header,
                body: message.body,
                ownedByCurrentUser: message.senderId === socketRef.current.id,
            };

            switch (incomingMessage.header) {
                case CONNECTION_VALIDATION_MESSAGE:
                    setConnectionEvent(incomingMessage.body);
                    break;
                    
                case SECOND_PLAYER_CONNECTED_MESSAGE:
                    setSecondPlayerConnectedEvent(true);
                    break;
                    
                case ROUND_STARTED_MESSAGE:
                    setPlayerOneScoreEvent(null);
                    setPlayerTwoScoreEvent(null);
                    setPlayerOneSubmittedEvent(null);
                    setPlayerTwoSubmittedEvent(null);
                    setRoundStartedEvent(incomingMessage.body);
                    break;

                case ANSWERS_SUBMITTED_EVENT:
                    if(incomingMessage.ownedByCurrentUser) {
                        setPlayerOneSubmittedEvent(incomingMessage.body);
                    }
                    else {
                        setPlayerTwoSubmittedEvent(incomingMessage.body);
                    }
                    break;

                case SCORE_SUBMITTED_EVENT:
                    if (incomingMessage.ownedByCurrentUser) {
                        setPlayerOneScoreEvent(incomingMessage.body);
                    } else {
                        setPlayerTwoScoreEvent(incomingMessage.body);
                    }
                    break;
                
                default:
                    break;
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    const sendEventMessage = (messageHeader, messageBody) => {
        socketRef.current.emit(GAME_EVENT_MESSAGE, {
            header: messageHeader,
            body: messageBody,
            senderId: socketRef.current.id,
        });
    };

    const connectToGameRoom = (isNewRoom, roomdId) => {
        setIsNewRoom(isNewRoom);
        setRoomId(roomdId);

        return connectionEvent;
    }

    return { 
        connectToGameRoom, roomId, sendEventMessage, connectionEvent, 
        secondPlayerConnectedEvent, roundStartedEvent, playerOneSubmittedEvent, playerTwoSubmittedEvent,
        playerOneScoreEvent, playerTwoScoreEvent
    };
}

export default GameManager;