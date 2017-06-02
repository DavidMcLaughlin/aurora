import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SchedulerClient from './client';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';

const Home = () => <div>Home</div>

const apiEnabledComponent = (Page) => (props) => <Page api={SchedulerClient} {...props}/>

const SchedulerUI = () => (
  <Router>
    <div>
      <Navigation/>
      <hr/>
      <Route exact path="/scheduler" component={apiEnabledComponent(HomePage)}/>
      <Route exact path="/scheduler/:role" component={Home}/>
      <Route exact path="/scheduler/:role/:environment" component={Home}/>
      <Route exact path="/scheduler/:role/:environment/:job" component={Home}/>
      <Route exact path="/scheduler/:role/:environment/:job/:instance" component={Home}/>
      <Route exact path="/scheduler/:role/:environment/:job/update/:update" component={Home}/>
      <Route exact path="/updates" component={Home}/>
    </div>
  </Router>
)

ReactDOM.render(<SchedulerUI/>, document.getElementById('root'))
