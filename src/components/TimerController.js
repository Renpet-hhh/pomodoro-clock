import React from 'react';
import "../components-style/TimerController.css";


export default (props) => {
    return (
        <button onClick={props.onClick} id={props.id} className="TimerController">
            <i className={props.icon}></i>
        </button>
    );
}

