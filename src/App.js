import React, { useContext, Suspense  } from 'react';

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

// ARCHIVES -----------------------------------------------------------

// Theme config
import theme from './themeConfig';

// Ruta protegida
import ProtectedRoute from './components/protected-route/ProtectedRoute';

// COMPONENTS ---------------------------------------------------------

// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { ThemeProvider } from '@material-ui/core/styles'

// Scroll
import { Scrollbars } from 'react-custom-scrollbars'

// Navigation
import NavBar from './components/navigation/NavBar';

// My courses
const MyCourses = React.lazy(() => import('./components/course/MyCourses'));

// Course view
const CourseView = React.lazy(() => import('./components/course/CourseView'));

// My activities
const MyActivities = React.lazy(() => import('./components/activity/MyActivities'));

// My activities
const CreateActivity = React.lazy(() => import('./components/activity/CreateActivity'));

// Logic sequence
const LogicSequence = React.lazy(() => import('./components/activity/logic-sequence/LogicSequence'));

// Users manage
const UserManage = React.lazy(() => import('./components/users/UserManage'));

// Create user
const CreateUser = React.lazy(() => import('./components/users/CreateUser'));

// Login
const Login = React.lazy(() => import('./components/login/Login'));

// Error 404
const Error404 = React.lazy(() => import('./components/error/Error404'));

function App() {

  return (
    <UserState>
        <Router>
          <div className="App">
            <NavBar/>
            <Suspense fallback={
              <div className="spinner-loading">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }>
              <div className="app-container">
                <Switch>    
                  {/* USER */}          
                  <ProtectedRoute type="admin, teacher" path='/user/:type/:action/:ID' exact component={CreateUser} />
                  <ProtectedRoute type="admin, teacher" path='/user/:type/:action/' exact component={CreateUser} />
                  <ProtectedRoute type="admin, teacher" path='/user/:type' exact component={UserManage} />

                  {/* COURSE */}
                  <ProtectedRoute path='/course/:type/:id/:view' exact component={CourseView} />
                  <ProtectedRoute path='/course/mycourses' exact component={MyCourses} />

                  {/* ACTIVITY */}
                  <ProtectedRoute type="admin, teacher" path='/activity/myActivities' exact component={MyActivities} />
                  <ProtectedRoute type="admin, teacher" path='/activity/create' exact component={CreateActivity} />
                  <ProtectedRoute type="admin, teacher" path='/activity/logic-sequence/:activityId' component={LogicSequence} />
                  
                  {/* INDEX/LOGIN */}
                  <Route path="/unauthorized" exact component={Error404} />

                  {/* INDEX/LOGIN */}
                  <Route path="/" exact component={Login} />

                  {/* ERRORS */}
                  <Route component={Error404} />
                </Switch>
              </div>
            </Suspense>
          </div>
        </Router>
    </UserState>
  );
}

export default App;
