import React from 'react';

const Layout = (props) => (
  <div>
    {props.nav}
    <div className='nav-divider' />
    <div className='container'>
      <div className='row'>
        {props.children}
      </div>
    </div>
  </div>
);

Layout.propTypes = {
  children: React.propTypes.element.isRequired,
  nav: React.propTypes.element.isRequired
};

export default Layout;
