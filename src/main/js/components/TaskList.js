import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Tr, Thead, Th, Td } from 'reactable';

import Panel from './Panel';
import TaskEvents, { TaskEventToggle } from './TaskEvents';
import { invert } from '../util/Utils';

const SCHEDULE_STATUS = invert(ScheduleStatus);

const TaskList = ({ tasks }) => {
  return (<Panel>
    <Table
      className='task-list'
      hideTableHeader
      itemsPerPage={25}
      pageButtonLimit={8}>
      {tasks.map((t) => {
        const { role, environment, name } = t.assignedTask.task.job;
        const message = t.taskEvents[t.taskEvents.length - 1].message;
        return (<Tr key={t.assignedTask.taskId}>
          <Td column='instance' className='task-list-instance'>
            <Link to={`/scheduler/${role}/${environment}/${name}/${t.assignedTask.instanceId}`}>
              {t.assignedTask.instanceId}
            </Link>
          </Td>
          <Td column='status' className='task-list-status'>
            <TaskEventToggle key={t.assignedTask.taskId} task={t} />
          </Td>
          <Td column='host' className='task-list-host'>
            <a href={`http://${t.assignedTask.slaveHost}:1338/task/${t.assignedTask.taskId}`}>
              {t.assignedTask.slaveHost}
            </a>
          </Td>
        </Tr>);
      })}
    </Table>
  </Panel>)
};

export default TaskList;
