import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidMount() {}

  render() {
    return (
      <div className='App'>
        Hello
        <div id='main-view'>
          <div id='map'>Map</div>
        </div>
      </div>
    );
  }
}

export default App;
