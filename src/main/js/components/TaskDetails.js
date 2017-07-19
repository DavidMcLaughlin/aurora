import React from 'react';

// TODO(dmcg): Move the slave host link into its own component.
export default ({ task }) => (<div className='active-task-details'>
  <div>
    <h5>Task ID</h5>
    <code>{task.assignedTask.taskId}</code>
    <a href={`/structdump/task/${task.assignedTask.taskId}`}>view raw config</a>
  </div>
  <div>
    <h5>Host</h5>
    <code>{task.assignedTask.slaveHost}</code>
    <a href={`http://${task.assignedTask.slaveHost}:1338/task/${task.assignedTask.taskId}`}>view sandbox</a>
  </div>
</div>);
