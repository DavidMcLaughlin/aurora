import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Tr, Thead, Th, Td } from 'reactable';

import { invert } from '../util/Utils';

const UPDATE_STATUS = invert(JobUpdateStatus);

const UpdateList = ({ updates }) => (<Table className='aurora-table'>
  {updates.map((u) => {
    const { role, environment, name } = u.key.job;
    return (<Tr>
      <Td column='id'>
        <Link to={`/scheduler/${role}/${environment}/${name}/update/${u.key.id}`}>{u.key.id}</Link>
      </Td>
      <Td column='status'>{UPDATE_STATUS[u.state.status]}</Td>
      <Td column='started'>{u.state.createdTimestampMs}</Td>
      <Td column='modified'>{u.state.lastModifiedTimestampMs}</Td>
      <Td column='user'>{u.user}</Td>
    </Tr>);
  })}
</Table>);

export default UpdateList;
