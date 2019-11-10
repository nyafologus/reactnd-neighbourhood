import React, { Component } from 'react';
import NavBar from './Components/NavBar.js';
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidMount() {}

  render() {
    return (
      <div className='App'>
        <NavBar />
        <Header />
        <div id='main-view'>
          <div id='map'>Map</div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
