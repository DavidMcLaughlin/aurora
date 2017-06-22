import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SchedulerClient from './client';
import HomePage from './components/pages/HomePage';
import InstancePage from './components/pages/InstancePage';
import JobPage from './components/pages/JobPage';
import RolePage from './components/pages/RolePage';
import UpdatePage from './components/pages/UpdatePage';

import Layout from './components/Layout';
import Navigation from './components/Navigation';

const Home = () => <div>Home</div>;

const apiEnabledComponent = (Page) => (props) => <Page api={SchedulerClient} {...props} />;

const SchedulerUI = () => (
  <Router>
    <Layout nav={<Navigation />}>
      <Route component={apiEnabledComponent(HomePage)} exact path='/scheduler' />
      <Route component={apiEnabledComponent(RolePage)} exact path='/scheduler/:role' />
      <Route component={apiEnabledComponent(RolePage)} exact path='/scheduler/:role/:environment' />
      <Route component={apiEnabledComponent(JobPage)} exact path='/scheduler/:role/:environment/:name' />
      <Route component={apiEnabledComponent(InstancePage)} exact path='/scheduler/:role/:environment/:name/:instance' />
      <Route component={apiEnabledComponent(UpdatePage)} exact path='/scheduler/:role/:environment/:name/update/:update' />
      <Route component={Home} exact path='/updates' />
    </Layout>
  </Router>
);

ReactDOM.render(<SchedulerUI />, document.getElementById('root'));
