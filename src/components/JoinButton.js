import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameManagerContext } from '../context/GameManagerContext';

import '../style/JoinButton.css';

function JoinButton() {
    const gameManager = useContext(GameManagerContext);
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [errorReason, setErrorReason] = useState(null);
  
    const CONNECTION_SUCCESS_MESSAGE = "Connected To: " + roomId;
    const CONNECTION_FAILURE_MESSAGES = [ ("Room Cannot Be Joined: " + roomId + " is already full..."), ("Failed To Join: " + roomId + " does not exist...")];

    useEffect(() => {
        if (gameManager.connectionEvent === null) {
            return;
        }
        
        // If there is an error in the game manager, display the error message and prevent navigation to the room.
        if (CONNECTION_FAILURE_MESSAGES.includes(gameManager.connectionEvent) && errorReason === null) {
            setErrorReason(gameManager.connectionEvent);
        } else if (gameManager.connectionEvent === CONNECTION_SUCCESS_MESSAGE) {
            navigate("/" + roomId);
        }

     }, [gameManager.connectionEvent]);

    const connnectToGameRoom = () => {
        gameManager.connectToGameRoom(false, roomId);
    }

    const handleRoomNameChange = (event) => {
        // Set the value of the input field to whatever was typed by the user.
        setRoomId(event.target.value.toLowerCase());
        
        // Reset the error values when the user enters a new room name.
        setErrorReason(null);
    }

    return (
        <div className="join-container">
            <div className="inputs-wrapper">
                <input 
                    className="join-input"
                    type="text" 
                    value={roomId} 
                    onChange={handleRoomNameChange}
                    placeholder="Room Name" />
                <button className="join-button" onClick={connnectToGameRoom}>Join Room</button>
            </div>
            { errorReason ? <p className="error-message">{errorReason}</p> : null }
        </div>
    );
}

export default JoinButton;