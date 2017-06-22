import React from 'react';
import { Link } from 'react-router-dom';

export default ({ fluid }) => (
  <nav className='navbar'>
    <div className={fluid ? 'container-fluid' : 'container'}>
      <div className='navbar-header'>
        <a className='navbar-brand' href='#'>
          <img alt='Brand' src='/assets/images/aurora-light-logo.png' />
        </a>
      </div>
      <ul className='nav navbar-nav navbar-right'>
        <li><Link to='/updates'>updates</Link></li>
      </ul>
    </div>
  </nav>
);
