import React from "react";
import "./App.css";
import LoginForm from "./component/LoginFrom";
import Home from "./component/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Storeprovider } from "./store/storeprovider";

function App() {
  /* Hello */

  return (
    <Storeprovider>
      <Router>
        <div>

          <Switch>
            <Route path="/Home"> 
              <Home />
            </Route>
            <Route path="/">
              <LoginForm />
            </Route>
          </Switch>
        </div>
      </Router>
    </Storeprovider>
  );
}

export default App;
