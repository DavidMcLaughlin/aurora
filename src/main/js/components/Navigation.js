import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <nav className='navbar navbar-default'>
    <div className='container'>
      <div className='navbar-header'>
        <a className='navbar-brand' href='#'>
          <img alt='Brand' src='/assets/images/aurora_logo.png' />
        </a>
      </div>
      <ul className='nav navbar-nav'>
        <li><Link to='/updates'>updates</Link></li>
      </ul>
    </div>
  </nav>
);
