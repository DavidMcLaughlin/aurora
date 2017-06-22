import React from 'react';

import Breadcrumb from '../Breadcrumb';
import Loading from '../Loading';
import RoleList from '../RoleList';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cluster: '', roles: [], loading: true};
  }

  componentWillMount(props) {
    const that = this;
    this.props.api.getRoleSummary((response) => {
      that.setState({
        cluster: response.serverInfo.clusterName,
        loading: false,
        roles: response.result.roleSummaryResult.summaries});
    });
  }

  render() {
    return this.state.loading ? <Loading /> : (<div>
      <div className='page-title'>
        <div className='container-fluid'>
          <Breadcrumb cluster={this.state.cluster} />
        </div>
      </div>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <RoleList roles={this.state.roles} />
          </div>
        </div>
      </div>
    </div>);
  }
}
