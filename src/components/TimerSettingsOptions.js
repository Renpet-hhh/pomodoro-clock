import React, { Component } from 'react'
import '../components-style/TimerSettingsOptions.css';
import '@fortawesome/fontawesome-free/css/all.css';


// callback is called with reset function as an argument
// onChange property will be called with current value as an argument
// freezeValue property, when true, prevents value changing
export default class TimerSettingsOptions extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.defaultValue };
        this.props.callback(this.resetValue);
    }

    incrementValue = () => {
        if (this.state.value >= 60 || this.props.freezeValue) return;
        this.props.onChange(this.state.value + 1); // let parent get updated value
        this.setState({ value: this.state.value + 1 });
    }

    decrementValue = () => {
        if (this.state.value <= 1 || this.props.freezeValue) return;
        this.props.onChange(this.state.value - 1); // let parent get updated value
        this.setState({ value: this.state.value - 1 });
    }

    resetValue = () => {
        this.props.onChange(this.props.defaultValue); // let parent get updated value
        this.setState({value: this.props.defaultValue});
    }

    render() {
        return ( // partialId is necessary to complete FCC's user stories
            <div className="TimerSettingsOptions">
                <label id={this.props.partialId + "-label"} className="timer-settings-label">{this.props.label}</label>
                <div className="settings-buttons-container">
                    <button onClick={this.incrementValue} id={this.props.partialId + "-increment"} className="increment-decrement-buttons">
                        <i className="fas fa-angle-up"></i>
                    </button>
                    <label id={this.props.partialId + "-length"}>{this.state.value}</label>
                    <button onClick={this.decrementValue} id={this.props.partialId + "-decrement"} className="increment-decrement-buttons">
                        <i className="fas fa-angle-down"></i>
                    </button>
                </div>
            </div>
        );
    }
}
