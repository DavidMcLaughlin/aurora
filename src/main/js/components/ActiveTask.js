import React from 'react';

import { ContentPanel } from 'components/Layout';
import TaskDetails from 'components/TaskDetails';
import TaskHistory from 'components/TaskHistory';

export default ({ task }) => (<div className='container'>
  <div className='row'>
    <div className='col-md-6'>
      <ContentPanel>
        <TaskDetails task={task} />
      </ContentPanel>
    </div>
    <div className='col-md-6'>
      <ContentPanel>
        <TaskHistory task={task} />
      </ContentPanel>
    </div>
  </div>
</div>);
