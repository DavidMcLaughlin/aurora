import React from 'react';

import Panel from './Panel';

const RoleList = (props) => (
  <Panel>
    <table className='table table-striped table-hover table-bordered table-condensed'>
      <thead>
        <tr>
          <th>role</th>
          <th>jobs</th>
          <th>crons</th>
        </tr>
      </thead>
      <tbody>
        {props.roles.map((r) => (
          <tr key={r.role}>
            <td>{r.role}</td>
            <td>{r.jobCount}</td>
            <td>{r.jobCount}</td>
          </tr>))}
      </tbody>
    </table>
  </Panel>
);

RoleList.propTypes = {
  roles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default RoleList;
