import { useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { GameManagerContext } from '../context/GameManagerContext';

import '../style/CreateButton.css';

function CreateButton() {
    const gameManager = useContext(GameManagerContext);
    const navigate = useNavigate();

    const createGameRoom = () => {
        var roomId = (Math.random() + 1).toString(36).substring(7);
        
        gameManager.connectToGameRoom(true, roomId);
        navigate("/" + roomId);
    }
    
    return (
        <div className="create-container">
            <button className="create-button" onClick={createGameRoom}>Create Room</button>
        </div>
    );
}

export default CreateButton;