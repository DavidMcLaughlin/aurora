import React from 'react';

import Breadcrumb from 'components/Breadcrumb';
import JobList from 'components/JobList';
import { TwoColumnLayout } from 'components/Layout';
import Loading from 'components/Loading';
import RoleQuota from 'components/RoleQuota';

export default class RolePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const that = this;
    this.props.api.getJobSummary(this.props.match.params.role, (response) => {
      const jobs = (that.props.match.params.environment)
        ? response.result.jobSummaryResult.summaries.filter(j => j.job.key.environment === that.props.match.params.environment)
        : response.result.jobSummaryResult.summaries;

      that.setState({ cluster: response.serverInfo.clusterName, jobs });
    });
    this.props.api.getQuota(this.props.match.params.role, (response) => {
      that.setState({
        cluster: response.serverInfo.clusterName,
        quota: response.result.getQuotaResult
      });
    });
  }

  render() {
    const quota = this.state.quota ? <RoleQuota quota={this.state.quota} /> : <Loading />;
    const jobs = this.state.jobs ? <JobList env={this.props.match.params.environment} jobs={this.state.jobs} /> : <Loading />;
    return (<div>
      <div className='page-title'>
        <div className='container-fluid'>
          <Breadcrumb
            cluster={this.state.cluster}
            env={this.props.match.params.environment}
            role={this.props.match.params.role} />
        </div>
      </div>
      <TwoColumnLayout left={jobs} right={quota} />
    </div>);
  }
}
