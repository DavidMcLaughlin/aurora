import React from 'react';

import ActiveTask from 'components/ActiveTask';
import Breadcrumb from 'components/Breadcrumb';
import { ContentPanel, TwoColumnLayout } from 'components/Layout';
import Loading from 'components/Loading';
import TaskEvents, { TaskEventToggle } from 'components/TaskEvents';

import { isActive } from 'util/TaskUtil';

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
        <ActiveTask task={activeTask} />
        <div className='secondary-title'>
          <div className='container'>
            <h2>Completed Tasks</h2>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <ContentPanel>
                <CompletedTasks tasks={this.state.tasks.filter((t) => !isActive(t))} />
              </ContentPanel>
            </div>
          </div>
        </div>
      </div>);
    }
    return <Loading />;
  }
}

export default InstancePage;
