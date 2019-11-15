import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import Broom from '../Icons/broom.png';

// This Component is mainly based on https://github.com/udacity/reactnd-contacts-complete/commit/4f7055abb1c197c1c5c968b472a643dedcb90ba1
// as well as Part 5 Building with React - Lesson:3 State Management - Controlled Components
class NavBar extends Component {
  state = {
    query: ''
  };

  updateQuery = (query) => {
    this.setState({ query: query.trim() });
  };

  render() {
    let chosenOnes = [];
    let visibility = this.props.visible === true ? 'open' : 'hidden';
    let tabindex = this.props.visible === true ? '0' : '-1';

    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      chosenOnes = this.props.markers.filter((marker) => match.test(marker.title));

      this.props.markers.map((marker) => {
        marker.setVisible(false);
        chosenOnes.forEach((item) => {
          if (item.title === marker.title) {
            item.setVisible(true);
          }
        });
      });
    } else {
      chosenOnes = this.props.markers;
      chosenOnes.forEach((item) => item.setVisible(true));
    }

    chosenOnes.sort(sortBy('title'));

    return (
      <div id='sidenav' className={visibility}>
        <button tabIndex={tabindex} aria-label='close icon' onClick={this.props.onMouseDown}>
          x
        </button>
        <div>
          <p className='leckerli'>Magical Places</p>
          <div className='search'>
            <img src={Broom} alt='broom icon' />
            <input
              aria-label='search magical places'
              tabIndex={tabindex}
              type='text'
              placeholder='Where are we going?'
              value={this.state.query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
          <ul>
            {chosenOnes.map((marker) => (
              <li
                key={marker.id}
                role='button'
                tabIndex={tabindex}
                onKeyPress={this.props.selectMarker.bind(this, marker)}
                onClick={this.props.selectMarker.bind(this, marker)}
              >
                {marker.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default NavBar;
