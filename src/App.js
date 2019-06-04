import React, { Component } from 'react';
import './App.css';
import PomodoroClock from './components/PomodoroClock';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startTimer = () => {

  }
  
  render() {
    return (
      <div className="App">
        <header id="title">Pomodoro Clock</header>
        <PomodoroClock></PomodoroClock>
      </div>
    );
  }
}

export default App;
