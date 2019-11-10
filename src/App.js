import React, { Component } from 'react';
import NavBar from './Components/NavBar.js';
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loads Magical Places array from external json file
      mylocations: require('./Data/Places.json'),
      data: []
    };
  }

  requestWikiData() {
    let wikiData = [];
    let noData = [];
    this.state.mylocations.map((location) => {
      // fetches data from Wikipedia API
      return (
        fetch(
          `https://en.wikipedia.org/w/api.php?&action=query&list=search&prop=extracts&titles&format=json&origin=*&srlimit=1&srsearch=${location.name}`
        )
          .then((res) => res.json())
          .then((data) => {
            // generates custom URL for more information
            let url = encodeURI(`https://en.wikipedia.org/wiki/${data.query.search['0'].title}`);
            let e = {
              text: data.query.search['0'].snippet,
              id: location.id,
              url: url,
              visitWiki: 'More information'
            };
            wikiData.push(e);
            this.setState({ data: wikiData });
          })
          // handles error in case of fetching failure
          .catch(() => {
            let e = {
              id: location.id,
              text: 'Unfortunately an error occured while obtaining data from Wikipedia',
              visitWiki: 'Please refresh'
            };
            console.log('ERROR! Wiki API could not load.');
            noData.push(e);
            this.setState({ data: noData });
          })
      );
    });
  }

  componentDidMount() {
    // starts requesting data from Wikipedia API
    this.requestWikiData();
  }

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
