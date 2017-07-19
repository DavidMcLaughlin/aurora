import React from 'react';
import { Link } from 'react-router-dom';

function url(...args) {
  return args.join('/');
}

export default (props) => {
  const { cluster, role, env, name, instance, update } = props;
  const crumbs = [<Link key="cluster" to='/scheduler'>{cluster}</Link>];
  if (role) {
    crumbs.push(<span key="role-divider">/</span>);
    crumbs.push(<Link key="role" to={`/scheduler/${url(role)}`}>{role}</Link>);
  }
  if (env) {
    crumbs.push(<span key="env-divider">/</span>);
    crumbs.push(<Link key="env" to={`/scheduler/${url(role, env)}`}>{env}</Link>);
  }
  if (name) {
    crumbs.push(<span key="name-divider">/</span>);
    crumbs.push(<Link key="name" to={`/scheduler/${url(role, env, name)}`}>{name}</Link>);
  }
  if (instance) {
    crumbs.push(<span key="instance-divider">/</span>);
    crumbs.push(<Link key="instance" to={`/scheduler/${url(role, env, name, instance)}`}>{instance}</Link>);
  }
  if (update) {
    crumbs.push(<span key="update-divider">/</span>);
    crumbs.push(<Link key="update" to={`/scheduler/${url(role, env, name, 'update', update)}`}>{update}</Link>);
  }
  return <h2 className='aurora-breadcrumb'>{crumbs}</h2>;
};
