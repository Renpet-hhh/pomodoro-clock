import React, { Component } from 'react'
import "../components-style/Timer.css";
import Worker from '../workers/Worker';
import WebWorker from '../utils/WebWorker';

// property callback can get reset, pause and resume functions as parameters
// property callbackAudio can get audio ref as the paramater
// onFinish will be called when currentTimeInSeconds === 0, with no parameters
export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {currentTimeInSeconds: this.props.defaultTime}; // this.props.defaultTime is only used in constructor
        this.audioRef = React.createRef();
        this.props.callback(this.resetTimer, this.pauseTimer, this.resumeTimer);
        this.timer = new WebWorker(Worker); // works in another thread, updating currentTimeInSeconds
        this.timer.postMessage([100, this.props.defaultTime*1000]);
        this.timer.onmessage = e => {
            if (e.data === "FINISH") {
                this.setState({currentTimeInSeconds: 0}, () => {
                    this.props.onFinish(); // calls parent's onFinish handler
                });
                
            } else if (Number.isFinite(e.data)) {
                this.setState({currentTimeInSeconds: e.data}); // worker is sending the updated currentTimeInSeconds
            } else {
                console.log(e.data); // catch missing messages, for now
            }
        };
    }

    componentDidUpdate() {
        console.log(document.getElementById("time-left").innerText);
    }

    convertTimeInSecondsToString = (timeInSeconds) => {
        let minutes = Math.floor(timeInSeconds/60);
        let seconds = timeInSeconds % 60;
        let minutesString = minutes < 10 ? "0" + minutes : "" + minutes;
        let secondsString = seconds < 10 ? "0" + seconds : "" + seconds;
        return minutesString + ":" + secondsString;
    }


    resetTimer = (time) => { // seconds
        this.timer.postMessage("STOP");
        this.setState({currentTimeInSeconds: time});
        this.timer.postMessage([100, time*1000]); // [interval in miliseconds, currentTime in miliseconds]
    }
    pauseTimer = () => {
        this.timer.postMessage("STOP");
    }
    resumeTimer = () => {
        this.timer.postMessage("RUN");
    }

    speedUp = (e) => {
        this.timer.postMessage("SPEED UP");
    }

    render() { // id is necessary for FCC's tests
        return (
            <div className="Timer">
                <label id="timer-label" className="timer-label">{this.props.mode}</label>
                <span id="time-left" className="time-left">{this.convertTimeInSecondsToString(
                    this.state.currentTimeInSeconds)}</span>
                <audio id="beep" ref={(ref) => this.props.callbackAudio(ref)} src={this.props.src} type={this.props.type}></audio>
                    <button onClick={this.speedUp}>Speed up</button>
            </div>
        )
    }
}
