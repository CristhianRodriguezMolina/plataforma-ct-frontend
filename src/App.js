import React, { Suspense } from 'react';

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

// Ruta protegida
import ProtectedRoute from './components/protected-route/ProtectedRoute';

// animate.css package
import 'animate.css/animate.min.css';

// COMPONENTS ---------------------------------------------------------

// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Navigation
import NavBar from './components/navigation/NavBar';

import ExpiredSessionConfirmation from './components/expired-session/ExpiredSessionConfirmation';

// My courses
const MyCourses = React.lazy(() => import('./components/course/MyCourses'));

// Course view
const CourseView = React.lazy(() => import('./components/course/CourseView'));

//Individual Progress
const IndividualProgress = React.lazy(() => import('./components/course/progress/IndividualProgress'));

// Manage Task
const ManageTask = React.lazy(() => import('./components/course/teacher-view/ManageTask'));

// Create activity
const CreateActivity = React.lazy(() => import('./components/activity/CreateActivity'));

// Users manage
const UserManage = React.lazy(() => import('./components/users/UserManage'));

// Create user
const CreateUser = React.lazy(() => import('./components/users/CreateUser'));

// Login
const Login = React.lazy(() => import('./components/login/Login'));

// Profile
const Profile = React.lazy(() => import('./components/profile/Profile'));

// Error 404
const Error404 = React.lazy(() => import('./components/error/Error404'));

//ACTIVITY COMPONENTS

// My activities
const MyActivities = React.lazy(() => import('./components/activity/MyActivities'));

// Maze (create maze view)
const Maze = React.lazy(() => import('./components/activity/maze/Maze'));

// Logic sequence (create logic sequence view)
const LogicSequence = React.lazy(() => import('./components/activity/logic-sequence/LogicSequence'));

//Questionnaire (create questionnaire view)
const Questionnaire = React.lazy(() => import('./components/activity/questionnaire/Questionnaire'));

//Logic sequence (student view)
const StudentActivity = React.lazy(() => import('./components/activity/StudentActivity'));

function App() {

  return (
    <UserState>
      <Router>
        <div className="App">
          <NavBar />
          <Suspense fallback={
            <div className="spinner-loading">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }>
            <div className="app-container">
              {/* <Box my={9.0}> */}
              <Switch>
                {/* USER */}
                <ProtectedRoute type="admin, teacher" path='/user/:type/:action/:ID' exact component={CreateUser} />
                <ProtectedRoute type="admin, teacher" path='/user/:type/:action/' exact component={CreateUser} />
                <ProtectedRoute type="admin, teacher" path='/user/:type' exact component={UserManage} />

                {/* COURSE */}
                <ProtectedRoute type='admin, teacher' path='/course/student/individual-progress/:studentId/:courseId' exact component={IndividualProgress} />
                <ProtectedRoute type="admin, teacher" path='/course/edit/:courseId/units-info/:unitId/:taskId' exact component={ManageTask} />
                <ProtectedRoute path='/course/:type/:id/:view' exact component={CourseView} />
                <ProtectedRoute path='/course/mycourses/:studentName' exact component={MyCourses} />
                <ProtectedRoute type="admin, teacher" path='/course/mycourses' exact component={MyCourses} />

                {/* ACTIVITY */}
                <ProtectedRoute path='/activity/:view/:courseId/:unitId/:taskId/:activityId' exact component={StudentActivity} />
                <ProtectedRoute type="admin, teacher" path='/activity/myActivities' exact component={MyActivities} />
                <ProtectedRoute type="admin, teacher" path='/activity/create' exact component={CreateActivity} />
                <ProtectedRoute type="admin, teacher" path='/activity/logic-sequence/:activityId' exact component={LogicSequence} />
                <ProtectedRoute type="admin, teacher" path='/activity/maze/:activityId' exact component={Maze} />
                <ProtectedRoute type="admin, teacher" path='/activity/questionnaire/:activityId' exact component={Questionnaire} />
                {/* <ProtectedRoute type="admin, teacher" path='/activity/questionnaire/student/:activityId' exact component={MazeStudent} /> */}

                {/* PROFILE */}
                <ProtectedRoute path='/profile/:userId/:view' exact component={Profile} />

                {/* SESSION EXPIRED */}
                <Route path="/session-expired" exact component={ExpiredSessionConfirmation} />

                {/* UNAUTHORIZED */}
                <Route path="/unauthorized" exact component={Error404} />

                {/* INDEX/LOGIN */}
                <Route path="/" component={Login} />

                {/* ERRORS */}
                <Route component={Error404} />
              </Switch>
              {/* </Box> */}
            </div>
          </Suspense>
        </div>
      </Router>
    </UserState>
  );
}

export default App;
