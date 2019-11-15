/* global google */
// credit to ArtemKislov on  his/her comment on Sep 17 2017 @ "https://github.com/tomchentw/react-google-maps/issues/414"

import React, { Component } from 'react';
import './App.css';
import NavBar from './Components/NavBar.js';
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';
import crowDefault from './Icons/crowDefault.png';
import crowHover from './Icons/crowHover.png';
import MapStyle from './Components/MapStyle.json';

class App extends Component {
  constructor(props) {
    super(props);
    // indicates map loading request
    this.state = {
      // load Magical Places array from external json file
      mylocations: require('./Data/Places.json'),
      request: false,
      // visibility refers to the state of navigation bar
      visible: false,
      // data array refers to fetched information from Wikipedia
      data: [],
      map: {},
      markers: [],
      infowindow: ''
    };
  }

  // toggle visibility of side Navigation Bar
  isNavBarVisible = () => {
    this.setState({
      visible: !this.state.visible
    });
  };

  requestWikiData() {
    let wikiData = [];
    let noData = [];
    this.state.mylocations.map((location) => {
      // fetch data from Wikipedia API
      return (
        fetch(
          `https://en.wikipedia.org/w/api.php?&action=query&list=search&prop=extracts&titles&format=json&origin=*&srlimit=1&srsearch=${location.name}`
        )
          .then((res) => res.json())
          .then((data) => {
            // generate custom URL for more information
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
          // handle error in case of fetching failure
          .catch(() => {
            let e = {
              id: location.id,
              text: 'Unfortunately an error occured while obtaining data from Wikipedia.',
              visitWiki: 'Please refresh the page.'
            };
            console.log('ERROR! Wiki API could not load.');
            noData.push(e);
            this.setState({ data: noData });
          })
      );
    });
  }

  // credit goes to commenters at https://stackoverflow.com/questions/48493960/using-google-map-in-react-component/
  loadMap() {
    if (!this.loadGM) {
      // define promise
      this.loadGM = new Promise((resolve) => {
        // add global handler upon successful API load
        window.resGM = () => {
          this.setState({ request: true });
          // resolve promise
          resolve(google);
          delete window.resGM;
        };

        // load GM API
        const script = document.createElement('script');
        const API = '';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resGM`;
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // return promise
    return this.loadGM;
  }

  initMap() {
    let map;
    this.loadMap().then((google) => {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.6666, lng: 19.2222 },
        // MapStyle from http://snazzymaps.com/style/146660/globex
        styles: MapStyle,
        zoom: 8,
        mapTypeControl: false,
        scrollwheel: false
      });
      // generate new infowindow to display location specific content
      var infowindow = new google.maps.InfoWindow({ maxWidth: 700 });
      this.generateMarkers(map);
      this.setState({ map, infowindow });
    });
  }

  generateMarkers(map) {
    let self = this;
    let bounds = new google.maps.LatLngBounds();
    let markers = [];

    // define location specific variables
    this.state.mylocations.forEach((item) => {
      let position = item.latlng;
      let title = item.name;
      let markerID = item.id;
      let markerImage = item.pic;
      let alt = item.alt;

      // generate markers on Google Maps
      let marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: crowDefault,
        id: markerID,
        image: markerImage,
        alt: alt
      });

      // add them one by one to markers array
      markers.push(marker);

      // handle click events
      marker.addListener('click', () => {
        self.selectMarker(marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 666);
      });

      // handle hover events
      marker.addListener('mouseover', function() {
        this.setIcon(crowHover);
      });

      // reset hover marker icon to default
      marker.addListener('mouseout', function() {
        this.setIcon(crowDefault);
      });

      bounds.extend(marker.position);
    });
    map.fitBounds(bounds);

    this.setState({ markers });
  }

  //select specific marker, populate its infowindow with relevant content
  selectMarker = (marker) => {
    this.state.infowindow.open(this.state.map, marker);
    this.state.data.filter((item) => {
      if (item.id === marker.id) {
        this.state.infowindow.setContent(`<div class=marker>
          <h1 class="leckerli center">${marker.title} </h1>
          <img class="marker-image" src=${marker.image} alt=${marker.alt}/>
          <div>
            <p>${item.text} ...</p>
            <a href=${item.url} target="_blank" rel="noopener noreferrer">${item.visitWiki}</a>
          </div>
        </div>`);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 666);
      }
    });
  };

  componentDidMount() {
    // request data from Wikipedia API
    this.requestWikiData();
    // initiate Google Maps API request
    this.loadMap();
    // load Google Maps
    this.initMap();
    // handle error upon Google Maps API failure by notifying the user
    window.gm_authFailure = () => {
      alert('An error occured while loading the map, please double check your Google API key!');
    };
  }

  render() {
    let hidden = this.state.visible === true ? 'hidden' : '';
    let tabindex = this.state.visible === true ? '-1' : '0';
    let scroll = this.state.visible === true ? 'scroll' : 'unscroll';

    return this.state.request === true ? (
      // load main App content if there is a request
      <div className='App'>
        <div>
          <NavBar
            markers={this.state.markers}
            infowindow={this.state.infowindow}
            onMouseDown={this.isNavBarVisible}
            visible={this.state.visible}
            selectMarker={this.selectMarker}
          />
          <div id='main-view' className={scroll}>
            <Header />
            <nav className={hidden}>
              <svg
                tabIndex={tabindex}
                onClick={this.isNavBarVisible}
                onKeyDown={this.isNavBarVisible}
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
            <div id='map' tabIndex='-1' aria-label='Budapest Map' role='application' />
            <Footer />
          </div>
        </div>
      </div>
    ) : (
      // othervise load error warning
      <div className='App'>
        <Header />
        <nav className='hidden' />
        <div id='err' className='leckerli fadeIn'>
          <h1>ERROR</h1>
          <h2>Unable to load content, please try again later.</h2>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
