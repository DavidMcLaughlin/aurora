import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Tr, Thead, Th, Td } from 'reactable';

export default ({ roles }) => (
  <Table
    className='aurora-table'
    defaultSort={{column: 'role'}}
    filterPlaceholder='Search roles...'
    filterable={['role']}
    itemsPerPage={25}
    pageButtonLimit={8}
    sortable>
    <Thead>
      <Th column='role'>role</Th>
      <Th className='number' column='jobs'>jobs</Th>
      <Th className='number' column='crons'>crons</Th>
    </Thead>
    {roles.map((r) => (<Tr key={r.role}>
      <Td column='role' value={r.role}><Link to={`/scheduler/${r.role}`}>{r.role}</Link></Td>
      <Td className='number' column='jobs'>{r.jobCount}</Td>
      <Td className='number' column='crons'>{r.cronJobCount}</Td>
    </Tr>))}
  </Table>
);
