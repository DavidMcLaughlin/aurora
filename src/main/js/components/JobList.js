import React from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icon';
import Panel from './Panel';

const JobListItem = (props) => {
  const taskStats = [];
  ['pendingTaskCount', 'activeTaskCount', 'finishedTaskCount', 'failedTaskCount'].forEach((k) => {
    if (props.stats[k] > 0) {
      const label = k.slice(0, -9);
      taskStats.push(<li><span className={`img-circle ${label}-task`} /> {props.stats[k]} </li>);
    }
  });

  const tierIcon = props.job.taskConfig.tier === 'preferred' ? <Icon name='star' /> : '';
  const envLink = props.env ? '' : (<span className='job-env'>
      <Link to={`/scheduler/${props.job.key.role}/${props.job.key.environment}`}>
        {props.job.key.environment}
      </Link>
    </span>);

  return (<div className='job-list-item flex-panel'>
    <span className='job-type'>
      {props.job.taskConfig.isService ? 'service' : (props.job.cronSchedule) ? 'cron' : 'adhoc'}
    </span>
    <h4>
      <Link to={`/scheduler/${props.job.key.role}/${props.job.key.environment}/${props.job.key.name}`}>
        {props.job.key.name} {tierIcon}
      </Link>
    </h4>
    {envLink}
    <span className='job-tier'>{props.job.taskConfig.tier}</span>
    <span className='filler' />
    <ul className='job-task-stats'>
      {taskStats}
    </ul>
  </div>);
}

const JobList = (props) => {
  const jobs = props.jobs.sort((a, b) => a.job.key.name > b.job.key.name ? 1 : -1);
  return (<div>
    <div className='flex-panel flex-panel-title'>
      <h4>Job List</h4>
      <ul className='job-task-stats'>
        <li><span className={`img-circle pending-task`} /> pending</li>
        <li><span className={`img-circle active-task`} /> active</li>
        <li><span className={`img-circle failed-task`} /> failed</li>
        <li><span className={`img-circle finished-task`} /> finished</li>
      </ul>
    </div>
    {jobs.map((j) => <JobListItem env={props.env} job={j.job} stats={j.stats} />)}
  </div>);
}

export default JobList;
