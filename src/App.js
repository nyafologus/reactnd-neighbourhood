import React, { Component } from 'react';
import NavBar from './Components/NavBar.js';
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // visibility refers to the state of navigation bar
      visible: false,
      // loads Magical Places array from external json file
      mylocations: require('./Data/Places.json'),
      data: []
    };
    this.NavBarIsVisible = this.NavBarIsVisible.bind(this);
  }

  // changes visibility of side Navigation Bar
  NavBarIsVisible() {
    this.setState({
      visible: !this.state.visible
    });
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
    let hidden = this.state.visible === true ? 'hidden' : '';
    let tabindex = this.state.visible === true ? '-1' : '0';

    return (
      <div className='App'>
        <NavBar visible={this.state.visible} onMouseDown={this.NavBarIsVisible} />
        <Header />
        <nav className={hidden}>
          <svg
            tabIndex={tabindex}
            onClick={this.NavBarIsVisible}
            onKeyDown={this.NavBarIsVisible}
            role='button'
            aria-label='open sidebar'
            alt='menu icon'
            xlink='http://www.w3.org/1999/xlink'
            viewBox='0 0 512 512'
          >
            {/* Ghost Menu Icon by https://image.flaticon.com/icons/svg/244/244284.svg */}
            <g>
              <path
                fill='#E2D8BD'
                d='M478.242,61.89c-4.642,0-9.064,0.938-13.089,2.633l-113.504,47.789V95.648
                      C351.648,42.823,308.825,0,256,0s-95.648,42.823-95.648,95.648v16.664L46.847,64.523c-4.025-1.695-8.447-2.633-13.089-2.633
                      C15.114,61.89,0,77.004,0,95.648h33.758v371.903c0,24.548,19.9,44.448,44.448,44.448s44.448-19.9,44.448-44.448
                      c0,24.548,19.9,44.448,44.448,44.448s44.448-19.9,44.448-44.448C211.552,492.1,231.452,512,256,512s44.448-19.9,44.448-44.448
                      c0,24.548,19.9,44.448,44.448,44.448c24.548,0,44.448-19.9,44.448-44.448c0,24.548,19.9,44.448,44.448,44.448
                      s44.448-19.9,44.448-44.448V95.648H512C512,77.004,496.886,61.89,478.242,61.89z'
              />
              <g>
                <path
                  fill='#68615B'
                  d='M230.681,115.341c-4.661,0-8.44-3.779-8.44-8.44V84.396c0-4.661,3.779-8.44,8.44-8.44
                        c4.661,0,8.44,3.779,8.44,8.44v22.505C239.121,111.562,235.342,115.341,230.681,115.341z'
                />
                <path
                  fill='#68615B'
                  d='M281.319,115.341c-4.661,0-8.44-3.779-8.44-8.44V84.396c0-4.661,3.779-8.44,8.44-8.44
                        s8.44,3.779,8.44,8.44v22.505C289.758,111.562,285.98,115.341,281.319,115.341z'
                />
              </g>
              <g>
                <circle fill='#A59D8C' cx='393.846' cy='383.156' r='8.44' />
                <circle fill='#A59D8C' cx='427.604' cy='416.914' r='8.44' />
              </g>
            </g>
          </svg>
        </nav>
        <div id='main-view'>
          <div id='map'>Map</div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
