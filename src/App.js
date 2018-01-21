import React, { Component } from 'react';
import Strip from './strip';
import './App.css';

/*
center: {
  pos: 0 < int < ledNumber,
  left: int,
  right: int,
  hue: angle
}
*/

const range = (start, end) =>
  Array.from(Array(end - start + 1), (_, i) => start + i);

const DEFAULT_COLOR = 'transparent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledNumber: 150,
      maxCenters: 15,
      newCenterProba: 0.4,
      delay: 25,
      centers: [],
      leds: [DEFAULT_COLOR],
      play: false,
    };
    this.calculateFrame = this.calculateFrame.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  calculateFrame() {
    const { newCenterProba, ledNumber, maxCenters, centers } = this.state;
    const leds = range(0, ledNumber - 1).map(i => DEFAULT_COLOR);
    let newCenter;
    const newCenters = [];

    if (Math.random() < newCenterProba) {
      const newCenterPos = Math.round(Math.random() * ledNumber);
      const neighboursTooClose = centers.reduce(
        (tooClose, { pos }) =>
          pos - newCenterPos < 2 && pos - newCenterPos > -2 ? true : tooClose,
        false
      );
      if (!neighboursTooClose) {
        newCenter = {
          pos: newCenterPos,
          left: newCenterPos,
          right: newCenterPos,
          hue: Math.round(Math.random() * 360),
        };
        centers.push(newCenter);
        if (centers.length > maxCenters) {
          centers.shift();
        }
      }
    }

    centers.forEach(({ pos, left, right, hue }) => {
      const leftCenter = centers.reduce((prev, curr) => {
        if (curr.pos >= pos) {
          return prev;
        } else {
          if (prev && pos - prev.pos < pos - curr.pos) {
            return prev;
          }
          return curr;
        }
      }, false);
      const leftBound = Math.floor(
        leftCenter ? pos - (pos - leftCenter.pos) / 2 : 0
      );
      let newLeft = Math.max(left, leftCenter ? leftCenter.pos : 0);
      if (left - 1 >= leftBound) {
        newLeft = left - 1;
      }

      const rightCenter = centers.reduce((prev, curr) => {
        if (curr.pos <= pos) {
          return prev;
        } else {
          if (prev && prev.pos - pos < curr.pos - pos) {
            return prev;
          }
          return curr;
        }
      }, false);
      const rightBound = Math.ceil(
        rightCenter ? pos + (rightCenter.pos - pos) / 2 : ledNumber - 1
      );
      let newRight = Math.min(right, rightCenter ? rightCenter.pos : ledNumber);
      if (right + 1 <= rightBound) {
        newRight = right + 1;
      }
      newCenters.push({
        pos,
        left: newLeft,
        right: newRight,
        hue,
      });

      range(newLeft, newRight).forEach(i => {
        leds[i] = `hsl(${hue}, 100%, 50%)`;
      });
    });

    this.setState({ centers: newCenters, leds });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.delay !== this.state.delay && nextState.play === true) {
      clearInterval(this.interval);
      this.interval = setInterval(this.calculateFrame, nextState.delay);
    }
  }

  togglePlay() {
    if (this.state.play) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(this.calculateFrame, this.state.delay);
    }
    this.setState({ play: !this.state.play });
  }

  render() {
    return (
      <div className="App">
        <h1>BubbLED</h1>
        <p>A demo for bubbling led strip</p>
        <Strip leds={this.state.leds} />
        <button onClick={this.togglePlay}>
          {this.state.play ? 'Pause' : 'Play'}
        </button>
      </div>
    );
  }
}

export default App;
