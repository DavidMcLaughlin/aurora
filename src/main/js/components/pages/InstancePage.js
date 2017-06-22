import React from 'react';

import Breadcrumb from '../Breadcrumb';
import { TwoColumnLayout } from '../Layout';
import Loading from '../Loading';
import TaskEvents, { TaskEventToggle } from '../TaskEvents';

import { isActive } from '../../util/TaskUtil';

// TODO(dmcg): Move the slave host link into its own component.
const TaskDetails = ({ task }) => (<div className='active-task-details'>
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


const TaskHistory = ({ task }) => (<div className='active-task-history'>
  <h5 className='task-details-title'>STATUS HISTORY</h5>
  <TaskEvents task={task} />
</div>);


const CompletedTask = ({ task }) => {
  return (<tr key={task.assignedTask.taskId}>
    <td><TaskEventToggle task={task} /></td>
    <td><a href={`/structdump/task/${task.assignedTask.taskId}`}>{task.assignedTask.taskId}</a></td>
    <td>
      <a href={`http://${task.assignedTask.slaveHost}:1338/task/${task.assignedTask.taskId}`}>
        {task.assignedTask.slaveHost}
      </a>
    </td>
  </tr>);
}


const CompletedTasks = ({ tasks }) => (<table className='psuedo-table'>
  <tbody>
    {tasks.map((t) => <CompletedTask task={t} />)}
  </tbody>
</table>);


class InstancePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { role, environment, name, instance } = this.props.match.params;
    const query = new TaskQuery();
    query.role = role;
    query.environment = environment;
    query.jobName = name;
    query.instanceIds = [instance];

    const that = this;
    this.props.api.getTasksWithoutConfigs(query, (rsp) => {
      that.setState({ cluster: rsp.serverInfo.clusterName, tasks: rsp.result.scheduleStatusResult.tasks });
    });
  }

  render() {
    const { role, environment, name, instance } = this.props.match.params;
    if (this.state.hasOwnProperty('tasks')) {
      const activeTask = this.state.tasks.filter(isActive)[0];

      return (<div>
        <div className='page-title'>
          <div className='container'>
            <Breadcrumb cluster={this.state.cluster} env={environment} instance={instance} name={name} role={role} />
          </div>
        </div>
        <div className='secondary-title'>
          <div className='container'>
            <h2>Active Task</h2>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <TaskDetails task={activeTask} />
            </div>
            <div className='col-md-6'>
              <TaskHistory task={activeTask} />
            </div>
          </div>
        </div>
        <div className='secondary-title'>
          <div className='container'>
            <h2>Completed Tasks</h2>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <CompletedTasks tasks={this.state.tasks.filter((t) => !isActive(t))} />
            </div>
          </div>
        </div>
      </div>);
    }
    return <Loading />;
  }
}

export default InstancePage;
