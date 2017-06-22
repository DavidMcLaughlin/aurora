import React from 'react';

import Breadcrumb from '../Breadcrumb';
import ConfigGroups from '../ConfigGroups';
import InstanceViz from '../InstanceViz';
import { Tabs, TwoColumnLayout } from '../Layout';
import Loading from '../Loading';
import TaskList from '../TaskList';
import UpdateList from '../UpdateList';

import { isActive } from '../../util/TaskUtil';
import { sort } from '../../util/Utils';

export const TaskTabs = ({ active, complete, history }) => (<div>
  <div className='flex-panel flex-panel-title'>
    <h4>Task List</h4>
  </div>
  <Tabs
    active='active'
    onSelect={(id) => history.push('?tasks=' + id)}
    tabs={[
      {id: 'active', name: 'Active Tasks', content: <TaskList tasks={active} />},
      {id: 'completed', name: 'Completed Tasks', content: <TaskList tasks={complete} />}]} />
</div>);

export default class JobPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.fetchConfigGroups();
    this.fetchTasks();
    this.fetchUpdates();
  }

  fetchConfigGroups() {
    const { role, environment, name} = this.props.match.params;
    const key = new JobKey();
    key.role = role;
    key.environment = environment;
    key.name = name;

    const that = this;
    this.props.api.getConfigSummary(key, (response) => {
      that.setState({ configSummary: response.result.configSummaryResult.summary.groups });
    });
  }

  fetchTasks() {
    const { role, environment, name} = this.props.match.params;
    const query = new TaskQuery();
    query.role = role;
    query.environment = environment;
    query.jobName = name;

    const that = this;
    this.props.api.getTasksWithoutConfigs(query, (response) => {
      that.setState({
        cluster: response.serverInfo.clusterName,
        tasks: response.result.scheduleStatusResult.tasks
      });
    });
    this.props.api.getPendingReason(query, (response) => {
      that.setState({ pendingReasons: response.result.getPendingReasonResult.reasons });
    });
  }

  fetchUpdates() {
    const { role, environment, name} = this.props.match.params;
    const query = new JobUpdateQuery();
    query.jobKey = new JobKey({role, environment, name});
    const that = this;
    this.props.api.getJobUpdateSummaries(query, (response) => {
      that.setState({ updates: response.result.getJobUpdateSummariesResult.updateSummaries });
    });
  }

  render() {
    const { role, environment, name } = this.props.match.params;
    const configSummary = this.state.configSummary ? <pre>{JSON.stringify(this.state.configSummary, null, 2)}</pre> : <Loading />;
    const activeTasks = sort(
      this.state.tasks ? this.state.tasks.filter(isActive) : [],
      (t) => t.assignedTask.instanceId);
    const completeTasks = sort(
      this.state.tasks ? this.state.tasks.filter(t => !isActive(t)) : [],
      (t) => t.taskEvents[t.taskEvents.length - 1].timestamp,
      true);

    const tasks = this.state.tasks
      ? <TaskTabs active={activeTasks} complete={completeTasks} history={this.props.history} />
      : <Loading/>;

    const updates = this.state.updates ?  <UpdateList updates={this.state.updates} /> : <Loading />;

    return (<div>
      <div className='page-title'>
        <div className='container-fluid'>
          <Breadcrumb cluster={this.state.cluster} env={environment} name={name} role={role} />
        </div>
      </div>
      <div className='flex-panel flex-panel-title'>
        <h4>Configuration Summary</h4>
      </div>
      <div className='flex-panel'>
        <ConfigGroups />
      </div>
      {tasks}
      <div className='flex-panel flex-panel-title'>
        <h4>Update History</h4>
      </div>
     {updates}
    </div>);
  }
}
