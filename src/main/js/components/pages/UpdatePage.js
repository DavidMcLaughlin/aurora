import moment from 'moment';
import React from 'react';

import Breadcrumb from 'components/Breadcrumb';
import Icon from 'components/Icon';
import InstanceViz from 'components/InstanceViz';
import { ContentBox } from 'components/Layout';
import Loading from 'components/Loading';
import StateMachine from 'components/StateMachine';
import { RelativeTime } from 'components/Time';

import { getClassForUpdateStatus } from 'util/StyleUtils';
import { UPDATE_ACTION, UPDATE_STATUS } from 'util/ThriftUtils';
import { instanceSummary, isSuccessfulUpdate, updateStats } from 'util/UpdateUtil';
import { sort } from 'util/Utils';

import data from './fixtures/in-progress-update.json';

const UpdateTimeDisplay = ({ timestamp }) => {
  return (<div className='update-time'>
    <span>{moment(timestamp).utc().format('ddd, MMM Do')}</span>
    <h4>{moment(timestamp).utc().format('HH:mm')}</h4>
    <span className='time-ago'><RelativeTime ts={timestamp} /></span>
  </div>);
};

const UpdateDuration = ({ update }) => {
  const duration = update.update.summary.state.lastModifiedTimestampMs - update.update.summary.state.createdTimestampMs;
  return <div className='update-duration'>Duration: {moment.duration(duration).humanize()}</div>;
};

const UpdateTimeRange = ({ update }) => {
  return (<div className='update-time-range'>
    <UpdateTimeDisplay timestamp={update.update.summary.state.createdTimestampMs} />
    <h5>~</h5>
    <UpdateTimeDisplay timestamp={update.update.summary.state.lastModifiedTimestampMs} />
  </div>);
};

const UpdateSettings = ({ update }) => {
  const settings = update.update.instructions.settings;
  return (<div>
    <h3 className='content-box-title'>Settings</h3>
    <table className='aurora-table'>
      <tr>
        <td>Batch Size</td>
        <td>{settings.updateGroupSize}</td>
      </tr>
      <tr>
        <td>Max Failures Per Instance</td>
        <td>{settings.maxPerInstanceFailures}</td>
      </tr>
      <tr>
        <td>Max Failed Instances</td>
        <td>{settings.maxFailedInstances}</td>
      </tr>
      <tr>
        <td>Minimum Waiting Time in Running</td>
        <td>{moment.duration(settings.minWaitInInstanceRunningMs).humanize()}</td>
      </tr>
      <tr>
        <td>Rollback On Failure?</td>
        <td>{settings.rollbackOnFailure ? 'yes' : 'no'}</td>
      </tr>
    </table>
  </div>);
};

const UpdateStats = ({ update }) => {
  const stats = updateStats(update);
  return (<div className='update-summary-stats'>
    <h5>Instance Summary</h5>
    <span className='stats'>
      {stats.instancesUpdated} / {stats.totalInstancesToBeUpdated} ({stats.progress}%)
    </span>
  </div>);
};

const UpdateTitle = ({ update }) => {
  return isSuccessfulUpdate(update)
    ? <span className='success-text'><Icon name='ok-sign' /> Update Complete</span>
    : <span className='error-text'><Icon name='remove-sign' /> Update Failed</span>;
};

const UpdateStatus = ({ update }) => {
  return (<div className='content-box'>
    <div className='content-box-banner'>
      <div className='content-box-banner-text'>
        <UpdateTitle update={update} />
      </div>
    </div>
    <span>
      Started by <strong>{update.update.summary.user}</strong>
    </span>
    <UpdateTimeRange update={update} />
    <UpdateDuration update={update} />
    <hr/>
    <UpdateEvents events={update.updateEvents} />
    <hr/>
    <UpdateSettings update={update} />
  </div>);
};

const InstanceEvent = ({ events, instanceId }) => {
  const states = events.map((e, i) => ({
    className: (i === events.length -1) ? 'active' : '',
    state: UPDATE_ACTION[e.action],
    timestamp: e.timestampMs
  }));
  return (<div className='update-instance-event'>
    <Icon name='chevron-right' />
    <span className='update-instance-event-id'>#{instanceId}</span>
    <span className='update-instance-event-status'>{UPDATE_ACTION[events[0].action]}</span>
    <span className='update-instance-event-time'>
      {moment(events[0].timestampMs).utc().format('HH:mm:ss') + ' UTC'}
    </span>
    <div className='update-instance-event-states'>
      <StateMachine className='instance-state-machine' states={states} />
    </div>
  </div>);
};

const InstanceEvents = ({ events }) => {
  const sortedEvents = sort(events, (e) => e.timestampMs, true);
  const instanceMap = {};
  const eventOrder = [];
  events.forEach((e) => {
    const existing = instanceMap[e.instanceId];
    if (existing) {
      instanceMap[e.instanceId].push(e);
    } else {
      eventOrder.push(e.instanceId);
      instanceMap[e.instanceId] = [e];
    }
  });
  return (<div className='instance-events'>
    <h5 className='content-box-subtitle'>Instance Events</h5>
    {eventOrder.map((instanceId) => <InstanceEvent events={instanceMap[instanceId]} instanceId={instanceId} />)}
  </div>);
};

const UpdateStateMachine = ({ events }) => {
  const states = events.map((e, i) => ({
    className: `${getClassForUpdateStatus(e.status)}${(i === events.length - 1) ? ' active' : ''}`,
    state: UPDATE_STATUS[e.status],
    message: e.message,
    timestamp: e.timestampMs
  }));
  const className = `update-state-machine ${getClassForUpdateStatus(events[events.length - 1].status)}`;
  return <StateMachine className={className} states={states} />;
};

const UpdateEvents = ({ events }) => (<div className='update-events'>
  <h5 className='content-box-subtitle'>Update States</h5>
  <UpdateStateMachine events={events} />
</div>);

const UpdateTimeline = ({ update }) => (<ContentBox title="Events">
  <UpdateStats update={update} />
  <InstanceViz instances={instanceSummary(update)} />
  <InstanceEvents events={update.instanceEvents} />
</ContentBox>);

const UpdateConfig = ({ update }) => {
  return <div>config</div>;
};

export default class UpdatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cluster: data.serverInfo.clusterName,
      update: data.result.getJobUpdateDetailsResult.detailsList[0]
    };
  }

  componentWillMount() {
    const { role, environment, name, uid } = this.props.match.params;

    const job = new JobKey();
    job.role = role;
    job.environment = environment;
    job.name = name;

    const key = new JobUpdateKey();
    key.job = job;
    key.id = uid;

    const query = new JobUpdateQuery();
    query.key = key;

    const that = this;
    this.props.api.getJobUpdateDetails(null, query, (response) => {
      // console.log(JSON.stringify(response, null, 2));
      // const update = response.result.getJobUpdateDetailsResult.detailsList[0];
      // TODO(dmcg): Consolidate the cluster-name handling.
      // that.setState({ cluster: response.serverInfo.clusterName, update });
    });
  }

  render() {
    const { role, environment, name, uid } = this.props.match.params;

    return (this.state.update)
      ? (<div>
          <div className='page-title'>
            <div className='container'>
              <Breadcrumb cluster={this.state.cluster} env={environment} name={name} role={role} update={uid} />
            </div>
          </div>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <UpdateStatus update={this.state.update} />
                    </div>
                    <div className='col-md-6'>
                      <UpdateTimeline update={this.state.update} />
                    </div>
                  </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <ContentBox title='Config'>
                  <UpdateConfig update={this.state.update} />
                </ContentBox>
              </div>
            </div>
          </div>
        </div>) : <Loading/>;
  }
}
