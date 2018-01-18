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

const range = (start, end) => Array.from(Array(end - start + 1), (_, i) => start + i);

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
    }
    this.calculateFrame = this.calculateFrame.bind(this);
  }

  calculateFrame() {
    const { newCenterProba, ledNumber, maxCenters, centers } = this.state;
    const leds = range(0, ledNumber - 1).map(i => DEFAULT_COLOR);
    let newCenter;
    const newCenters = [];

    if (Math.random() < newCenterProba) {
      const newCenterPos = Math.round(Math.random() * ledNumber);
      const neighboursTooClose = centers.reduce((tooClose,{pos}) => (
        pos - newCenterPos < 2 && pos - newCenterPos > -2 ? true : tooClose
      ), false);
      if(!neighboursTooClose) {
        newCenter = {
          pos: newCenterPos,
          left:0,
          right:0,
          hue: Math.round(Math.random() * 360),
        }
        centers.push(newCenter);
        if(centers.length > maxCenters) { centers.shift(); }
      }
    }

    centers.forEach(({pos, left, right, hue}) => {
      const leftCenter = centers.reduce((prev, curr) => {
        if (curr.pos >= pos) {
          return prev;
        } else {
          if ((prev || prev === 0) && pos - prev < pos - curr.pos) {
            return prev;
          }
          return curr.pos;
        }
      }, false);
      const leftBound = Math.floor((leftCenter || leftCenter === 0) ? pos - (pos - leftCenter) / 2 : 0);
      let newLeft = left;
      if(pos - (left - 1) <= leftBound) {
        newLeft = left - 1;
      } else if (pos - (left + 1) >= leftBound) {
        newLeft = left + 1;
      }
 
      const rightCenter = centers.reduce((prev, curr) => {
        if (curr.pos <= pos) {
          return prev;
        } else {
          if (prev && prev.pos - pos < curr.pos - pos) {
            return prev;
          }
          return curr.pos;
        }
      }, false);
      const rightBound = Math.ceil(rightCenter ? pos + (rightCenter - pos) / 2 : ledNumber - 1);
      let newRight = right;
      if(pos + (right - 1) >= rightBound) {
        newRight = right - 1;
      } else if ( pos + (right + 1) <= rightBound) {
        newRight = right + 1;
      }
      newCenters.push({
        pos,
        left: newLeft,
        right: newRight,
        hue,
      })
      range(pos - newLeft, pos + newRight).forEach(i => { leds[i] = `hsl(${hue}, 100%, 50%)`; });
    })

    this.setState({ centers: newCenters, leds });
  }

  componentDidMount() {
    this.calculateFrame();
    this.interval = setInterval(this.calculateFrame, this.state.delay);
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.delay !== this.state.delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.calculateFrame, nextState.delay);
    }
  }
  render() {
    return (
      <div className="App">
        <h1>BubbLED</h1>
        <p>A demo for bubbling led strip</p>
        <Strip leds={this.state.leds} />
      </div>
    );
  }
}

export default App;
