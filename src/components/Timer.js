import { React, useEffect, useState } from 'react';

import '../style/Timer.css';


const Timer = (props) => {
    const [minutes, setMinutes] = useState(3);
    const [seconds, setSeconds] = useState(0);

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (3 * 60500) * 100000000);

    const getTime = () => {
        const time = endTime - Date.now();
        
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    }

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (seconds === -1 && minutes === -1) {
            props.setIsTimeUp(true);
        }
    }, [seconds]);

    return (
        
        <div className="timer-container">
            <div className="timer-border">
                <p className="time-remaining">{minutes < 10 ? minutes : minutes }:{seconds < 10 ? "0" + seconds : seconds}</p>
            </div>
        </div>

    );
};

export default Timer;