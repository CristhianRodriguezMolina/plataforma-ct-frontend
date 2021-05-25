import React from 'react';

// SCSS
import './App.scss';

// BOOTSTRAP -----------------------------------------------------------

// scss
import 'bootstrap/scss/bootstrap.scss';

// js
import 'bootstrap/dist/js/bootstrap';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';

// COMPONENTS ---------------------------------------------------------

// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Navigation
import NavBar from './components/navigation/NavBar';

// My courses
import MyCourses from './components/course/MyCourses';

// My activities
import MyActivities from './components/activity/MyActivities';

// My activities
import CreateActivity from './components/activity/CreateActivity';

import { DndProvider } from 'react-dnd'

import { HTML5Backend } from 'react-dnd-html5-backend'


// Error 404
import Error404 from './components/error/Error404';
import LogicSequence from './components/activity/logic-sequence/LogicSequence';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App">
          <NavBar/>
          <div className="app-container">
            <Switch>
              <Route path="/" exact />
              <Route path='/course/mycourses' exact component={MyCourses} />
              <Route path='/activity/myActivities' exact component={MyActivities} />
              <Route path='/activity/create' exact component={CreateActivity} />
              <Route path='/activity/logic-sequence' component={LogicSequence} />
              <Route component={Error404} />
            </Switch>
          </div>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
