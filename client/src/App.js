import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HabitDetail from './components/HabitDetail';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navigation isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Switch>
          <Route path="/login" render={(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" render={(props) => isAuthenticated ? <Dashboard {...props} /> : <Redirect to="/login" />} />
          <Route path="/habit/:id" render={(props) => isAuthenticated ? <HabitDetail {...props} /> : <Redirect to="/login" />} />
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;