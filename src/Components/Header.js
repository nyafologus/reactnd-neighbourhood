import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../Icons/moon-logo.svg';

const Header = () => (
  <header role='banner' aria-label='main-heading'>
    <Link to='/' tabIndex='1' aria-label='Budapest by Night'>
      <Logo className='App-logo' alt='moon logo' />
    </Link>
    <div>
      <h1 className='App-title leckerli'> Budapest at Midnight</h1>
    </div>
  </header>
);

export default Header;
