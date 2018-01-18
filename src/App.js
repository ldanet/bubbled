import React, { Component } from 'react';
import Strip from './strip';
import './App.css';

const dummyLeds = ['#ff0000', '#ffff00', '#00ff00',,'#00ffff','#0000ff', '#ff00ff']

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>BubbLED</h1>
        <p>A demo for bubbling led strip</p>
        <Strip leds={dummyLeds} />
      </div>
    );
  }
}

export default App;
