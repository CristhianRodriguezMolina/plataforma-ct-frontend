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

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar/>
        <div className="container">
          <Switch>
            <Route path='/course/mycourses' exact component={MyCourses}/>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
