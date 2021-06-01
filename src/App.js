import React from 'react';

// SCSS
import './App.scss';

// BOOTSTRAP ----------------------------------------------------------

// scss
import 'bootstrap/scss/bootstrap.scss';

// js
import 'bootstrap/dist/js/bootstrap';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';

// CONTEXT -----------------------------------------------------------

// User State
import UserState from './context/user/UserState';

// COMPONENTS ---------------------------------------------------------

// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Navigation
import NavBar from './components/navigation/NavBar';

// My courses
import MyCourses from './components/course/MyCourses';

// Course view
import CourseView from './components/course/CourseView';

// My activities
import MyActivities from './components/activity/MyActivities';

// My activities
import CreateActivity from './components/activity/CreateActivity';

// Logic sequence
import LogicSequence from './components/activity/logic-sequence/LogicSequence';

// Users manage
import UserManage from './components/users/UserManage';

// Create user
import CreateUser from './components/users/CreateUser';

// Error 404
import Error404 from './components/error/Error404';

function App() {
  return (
    <UserState>
      <Router>
        <div className="App">
          <NavBar/>
          <div className="app-container">
            <Switch>              
              <Route path='/user/:type/:action/:ID' component={CreateUser} />
              <Route path='/user/:type/:action/' component={CreateUser} />
              <Route path='/user/:type' exact component={UserManage} />
              <Route path='/course/:type/:id' exact component={CourseView} />
              <Route path='/course/mycourses' exact component={MyCourses} />
              <Route path='/activity/myActivities' exact component={MyActivities} />
              <Route path='/activity/create' exact component={CreateActivity} />
              <Route path='/activity/logic-sequence/:activityId' component={LogicSequence} />
              <Route path="/" exact />
              <Route path='/activity/logic-sequence/:activityId'>
                <LogicSequence/>
              </Route>
              <Route component={Error404} />
            </Switch>
          </div>
        </div>
      </Router>
    </UserState>
  );
}

export default App;
