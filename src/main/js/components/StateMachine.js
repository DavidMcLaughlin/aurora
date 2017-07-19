import React from 'react';
import moment from 'moment';

const StateItem = ({ className, state, message, timestamp }) => (<li className={className}>
  <div className='state-machine-item'>
    <svg><circle cx={6} cy={6} r={5} className='state-machine-bullet' /></svg>
    <div className='state-machine-item-details'>
      <span className='state-machine-item-state'>{state}</span>
      <span className='state-machine-item-time'>
        {moment(timestamp).utc().format('MM/DD HH:mm:ss') + ' UTC'}<br/>
        ({moment(timestamp).fromNow()})
      </span>
      <span className='state-machine-item-message'>{message}</span>
    </div>
  </div>
</li>);

export default ({ className, states }) => (<div className='state-machine'>
  <ul className={className}>
    {states.map((s) => <StateItem {...s} />)}
  </ul>
</div>);
