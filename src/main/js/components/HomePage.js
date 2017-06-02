import React from 'react'

import Loading from './Loading'

export const RoleList = (props) => (
  <table className="table">
    <tbody>
    {props.roles.map(r => (
       <tr key={r.role}>
         <td>{r.role}</td>
         <td>{r.jobCount}</td>
         <td>{r.jobCount}</td>
        </tr>))}
    </tbody>
  </table>
)

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {roles: [], loading: true};
  }

  componentWillMount(props) {
    const that = this;
    this.props.api.getRoleSummary((response) => {
      that.setState({roles: response.result.roleSummaryResult.summaries, loading: false})
    })
  }

  render() {
    return this.state.loading ? <Loading/> : <RoleList roles={this.state.roles}/>
  }
}
