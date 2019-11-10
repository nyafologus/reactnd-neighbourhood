import React, { Component } from 'react';
import Header from './Components/Header.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidMount() {}

  render() {
    return (
      <div className='App'>
        <Header />
        <div id='main-view'>
          <div id='map'>Map</div>
        </div>
      </div>
    );
  }
}

export default App;
