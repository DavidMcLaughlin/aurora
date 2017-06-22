import React from 'react';
import { Link } from 'react-router-dom';

function url(...args) {
  return args.join('/');
}

export default (props) => {
  const { cluster, role, env, name, instance } = props;
  const crumbs = [<Link to='/scheduler'>{cluster}</Link>];
  if (props.role) {
    crumbs.push(<span>/</span>);
    crumbs.push(<Link to={`/scheduler/${url(role)}`}>{role}</Link>);
  }
  if (env) {
    crumbs.push(<span>/</span>);
    crumbs.push(<Link to={`/scheduler/${url(role, env)}`}>{env}</Link>);
  }
  if (props.name) {
    crumbs.push(<span>/</span>);
    crumbs.push(<Link to={`/scheduler/${url(role, env, name)}`}>{name}</Link>);
  }
  if (props.instance) {
    crumbs.push(<span>/</span>);
    crumbs.push(<Link to={`/scheduler/${url(role, env, name, instance)}`}>{instance}</Link>);
  }
  return <h2 className='aurora-breadcrumb'>{crumbs}</h2>;
};
