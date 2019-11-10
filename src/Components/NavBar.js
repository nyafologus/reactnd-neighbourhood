import React, { Component } from 'react';
import Broom from '../Icons/broom.png';

class NavBar extends Component {
  render() {
    return (
      <div id='sidenav'>
        <button aria-label='close icon'>x</button>
        <div>
          <p className='leckerli'>Magical Places</p>
          <div className='search'>
            <img src={Broom} alt='broom icon' />
            <input aria-label='search magical places' type='text' placeholder='Where are we going?' />
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
