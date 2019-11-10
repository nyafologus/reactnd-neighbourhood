import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer role='contentinfo'>
    <p>
      Copyright (c) 2019 <Link to='/'>Budapest by Night - React x Google Maps x Wiki App</Link>
    </p>
    <div>
      Icons made by{' '}
      <a href='http://www.freepik.com' title='Freepik'>
        Freepik
      </a>{' '}
      from{' '}
      <a href='https://www.flaticon.com/' title='Flaticon'>
        www.flaticon.com
      </a>{' '}
      is licensed by{' '}
      <a href='http://creativecommons.org/licenses/by/3.0/' title='Creative Commons BY 3.0'>
        CC 3.0 BY
      </a>
    </div>
  </footer>
);

export default Footer;
