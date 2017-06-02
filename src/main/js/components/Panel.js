import React from 'react';

const Panel = (props) => <div className='content-panel'>{props.children}</div>;

Panel.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default Panel;
