import React from 'react';

import TaskEvents from 'components/TaskEvents';

export default ({ task }) => (<div className='active-task-history'>
  <h5 className='task-details-title'>STATUS HISTORY</h5>
  <TaskEvents task={task} />
</div>);
