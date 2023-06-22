import { useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { GameManagerContext } from '../context/GameManagerContext';

import '../style/CreateButton.css';

function CreateButton() {
    const gameManager = useContext(GameManagerContext);
    const navigate = useNavigate();

    const generateRandomRoomId = () => {
        return (Math.random() + 1).toString(36).substring(7).toLowerCase();
    };

    const createGameRoom = () => {
        var roomId = generateRandomRoomId();
        var isNewRoom = true;
        
        gameManager.connectToGameRoom(isNewRoom, roomId);
        navigate("/" + roomId);
    };
    
    return (
        <div className="create-container">
            <button className="create-button" onClick={createGameRoom}>Create Room</button>
        </div>
    );
};

export default CreateButton;