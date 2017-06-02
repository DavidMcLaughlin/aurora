import React from 'react';

import Loading from './Loading';
import RoleList from './RoleList';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {roles: [], loading: true};
  }

  componentWillMount(props) {
    const that = this;
    this.props.api.getRoleSummary((response) => {
      that.setState({roles: response.result.roleSummaryResult.summaries, loading: false});
    });
  }

  render() {
    return this.state.loading ? <Loading /> : <RoleList roles={this.state.roles} />;
  }
}

HomePage.propTypes = {
  api: React.PropTypes.object.isRequired
};
