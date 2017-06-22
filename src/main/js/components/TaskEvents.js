import React from 'react';
import moment from 'moment';

import { getClassForScheduleStatus } from '../util/StyleUtils';
import { SCHEDULE_STATUS } from '../util/ThriftUtils';

export class TaskEventToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    const events = (this.state.expanded)
      ? <TaskEvents task={this.props.task} />
      : (<div className='task-events'><ul>
          <TaskEvent active event={this.props.task.taskEvents[this.props.task.taskEvents.length - 1]} />
         </ul></div>);

    return (<div
        className='task-event-preview'
        onClick={(e) => this.setState({ expanded: !this.state.expanded })}>
       {events}
    </div>);
  }
}

export const TaskEvent = ({ event, active }) => {
  const className = `${getClassForScheduleStatus(event.status)}${active ? ' active' : ''}`;
  return (<li className={className}>
    <div className='task-event-container'>
      <svg><circle cx={6} cy={6} r={5} className='task-event-list-bullet' /></svg>
      <div className='task-event-details'>
        <span className='task-event-status'>{SCHEDULE_STATUS[event.status]}</span>
        <span className='task-event-time'>
          {moment(event.timestamp).utc().format('MM/DD HH:mm:ss') + ' UTC'}<br/>
          ({moment(event.timestamp).fromNow()})
        </span>
        <span className='task-event-message'>{event.message}</span>
      </div>
    </div>
  </li>);
};

const TaskEvents = ({ task }) => (<div className='task-events'>
  <ul className={getClassForScheduleStatus(task.taskEvents[task.taskEvents.length - 1].status)}>
    {task.taskEvents.map(
      (e, i) => <TaskEvent active={i === task.taskEvents.length - 1} event={e} />)}
  </ul>
</div>);

export default TaskEvents;
