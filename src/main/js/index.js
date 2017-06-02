import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SchedulerClient from './client';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import Navigation from './components/Navigation';

const Home = () => <div>Home</div>;

const apiEnabledComponent = (Page) => (props) => <Page api={SchedulerClient} {...props} />;

const SchedulerUI = () => (
  <Router>
    <Layout nav={<Navigation />}>
      <Route component={apiEnabledComponent(HomePage)} exact path='/scheduler' />
      <Route component={Home} exact path='/scheduler/:role' />
      <Route component={Home} exact path='/scheduler/:role/:environment' />
      <Route component={Home} exact path='/scheduler/:role/:environment/:job' />
      <Route component={Home} exact path='/scheduler/:role/:environment/:job/:instance' />
      <Route component={Home} exact path='/scheduler/:role/:environment/:job/update/:update' />
      <Route component={Home} exact path='/updates' />
    </Layout>
  </Router>
);

ReactDOM.render(<SchedulerUI />, document.getElementById('root'));
