import React, { Component } from 'react'
import TimerSettingsButton from './TimerSettingsOptions';
import Space from './Space';
import Timer from './Timer';
import TimerController from './TimerController';

export default class PomodoroClock extends Component {
    constructor(props) {
        super(props);
        this.state = {isTimerRunning: false, playIcon: "fas fa-play",
                    mode: "Session", sessionTime: 25, breakTime: 5}; // minutes
    }

    // called by TimerController button when clicked
    startStopTimer = () => {
        if (this.state.isTimerRunning) {
            this.state.pauseTimer();
            this.setState({playIcon: "fas fa-play"});
        } else {
            this.state.resumeTimer();
            this.setState({playIcon: "fas fa-pause"});
        }
        this.setState({isTimerRunning: !this.state.isTimerRunning});
    }

    // get resetTimer, pauseTimer and resumeTimer from Timer.js
    timerCallback = (reset, pause, resume) => {
        this.setState({resetTimer: reset, pauseTimer: pause, 
            resumeTimer: resume});
    }

    // get audio from Timer.js
    callbackAudio = (audio) => {
        this.audio = audio;
    }

    // TimerSettingsOptions will call these functions when its value changes, with the updated value as parameter
    setBreakTime = (value) => {
        this.setState({breakTime: value}); // minutes
        if (this.state.mode === "Break") this.state.resetTimer(value*60); // seconds
    }
    setSessionTime = (value) => {
        this.setState({sessionTime: value}); // minutes
        if (this.state.mode === "Session") this.state.resetTimer(value*60); // seconds
    }

    // called by TimerController button when clicked
    reset = () => {
        this.state.resetTimer(1500); // seconds
        this.setState({isTimerRunning: false, playIcon: "fas fa-play", mode: "Session"}); // minutes
        this.state.resetBreakTime();
        this.state.resetSessionTime();
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    // called by Timer when its internal timer worker finishes
    handleTimeFinish = () => {
        if (this.state.mode === "Session") {
            this.audio.play();
            this.setState({mode: "Break"}, () => {
                this.state.resetTimer(this.state.breakTime*60); // seconds
                this.state.resumeTimer();
            });
        } else {
            this.audio.play();
            this.setState({mode: "Session"}, () => {
                this.state.resetTimer(this.state.sessionTime*60); // seconds
                this.state.resumeTimer();
            });
        }
    }

    render() {
        return (
            <div>
                <div id="time-settings-container">
                    <TimerSettingsButton callback={(reset) => this.setState({resetBreakTime: reset})} 
                    onChange={this.setBreakTime} partialId="break" label="Break Length" defaultValue={5}
                    freezeValue={this.state.isTimerRunning}></TimerSettingsButton>
                    <Space marginLeft="3rem"></Space>
                    <TimerSettingsButton callback={(reset) => this.setState({resetSessionTime: reset})} 
                    onChange={this.setSessionTime} partialId="session" label="Session Length" defaultValue={25}
                    freezeValue={this.state.isTimerRunning}></TimerSettingsButton>
                </div>
                <Space marginTop="3rem"></Space>
                <Timer callback={this.timerCallback} mode={this.state.mode}
                    defaultTime={this.state.sessionTime*60} // seconds
                    callbackAudio={this.callbackAudio}
                    onFinish={this.handleTimeFinish} src="https://onlineclock.net/audio/options/default.mp3" type="audio/mp3"></Timer>
                <div id="timer-controllers-container">
                    <TimerController onClick={this.startStopTimer} id="start_stop" icon={this.state.playIcon}></TimerController>
                    <TimerController onClick={this.reset} id="reset" icon="fas fa-redo"></TimerController>
                </div>
            </div>
        )
    }
}
