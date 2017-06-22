import React from 'react';

const QUOTA_TYPE_ORDER = [
  'quota',
  'prodSharedConsumption',
  'prodDedicatedConsumption',
  'nonProdSharedConsumption',
  'nonProdDedicatedConsumption'
];

const QUOTA_TYPE_MAP = {
  'quota': 'Quota',
  'prodSharedConsumption': 'Quota Used',
  'nonProdSharedConsumption': 'Non-Production',
  'prodDedicatedConsumption': 'Production Dedicated',
  'nonProdDedicatedConsumption': 'Non-Production Dedicated'
};


const UNITS = ['MiB', 'GiB', 'TiB', 'PiB', 'EiB'];

function formatMb(sizeInMb) {
  const unitIdx = (sizeInMb > 0) ? Math.floor(Math.log(sizeInMb) / Math.log(1024)) : 0;
  return (sizeInMb / Math.pow(1024, unitIdx)).toFixed(2) + '' + UNITS[unitIdx];
}

const CONVERSIONS = {
  diskMb: formatMb,
  ramMb: formatMb
};

function format(resource) {
  const resourceKey = Object.keys(resource).find(key => resource[key] !== null);
  return (CONVERSIONS[resourceKey])
    ? CONVERSIONS[resourceKey](resource[resourceKey])
    : resource[resourceKey];
}

function getResource(resources, key) {
  return format(resources.find(r => r[key] !== null));
}

function findResource(resource) {
  const resourceKey = Object.keys(resource).find(key => resource[key] !== null);
  return resource[resourceKey];
}

const totalResources = (resources) => resources.map(findResource).reduce((acc, val) => acc + val);

const RoleQuota = ({ quota }) => {
  const quotas = QUOTA_TYPE_ORDER.filter(t => totalResources(quota[t].resources) > 0);

  return (<div>
    <div className='flex-panel flex-panel-title'>
      <h4>Resources</h4>
    </div>
    <div className='flex-panel'>
      <table className='aurora-table'>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>cpus</th>
            <th>ram</th>
            <th>disk</th>
          </tr>
        </thead>
        <tbody>
          {quotas.map((t) => (
            <tr key={t}>
              <td>{QUOTA_TYPE_MAP[t]}</td>
              <td>{getResource(quota[t].resources, 'numCpus')}</td>
              <td>{getResource(quota[t].resources, 'ramMb')}</td>
              <td>{getResource(quota[t].resources, 'diskMb')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>);
}
export default RoleQuota;
