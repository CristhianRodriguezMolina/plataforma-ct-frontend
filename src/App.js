import React, { useContext } from 'react';

// CONTEXT 
import UserContext from './context/user/UserContext';

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

import { ThemeProvider } from '@material-ui/core/styles'

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

// Login
import Login from './components/login/Login';

// Error 404
import Error404 from './components/error/Error404';

// ARCHIVES

// Theme config
import theme from './themeConfig';

// Ruta protegida
import ProtectedRoute from './components/protected-route/ProtectedRoute';

function App() {

  return (
    <UserState>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <NavBar/>
            <div className="app-container">
              <Switch>    
                {/* USER */}          
                <ProtectedRoute type="admin, teacher" path='/user/:type/:action/:ID' component={CreateUser} />
                <ProtectedRoute type="admin, teacher" path='/user/:type/:action/' component={CreateUser} />
                <ProtectedRoute type="admin, teacher" path='/user/:type' exact component={UserManage} />

                {/* COURSE */}
                <ProtectedRoute path='/course/:type/:id' exact component={CourseView} />
                <ProtectedRoute path='/course/mycourses' exact component={MyCourses} />

                {/* ACTIVITY */}
                <ProtectedRoute type="admin, teacher" path='/activity/myActivities' exact component={MyActivities} />
                <ProtectedRoute type="admin, teacher" path='/activity/create' exact component={CreateActivity} />
                <ProtectedRoute type="admin, teacher" path='/activity/logic-sequence/:activityId' component={LogicSequence} />

                {/* INDEX/LOGIN */}
                <Route path="/" exact component={Login} />

                {/* ERRORS */}
                <Route component={Error404} />
              </Switch>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </UserState>
  );
}

export default App;
