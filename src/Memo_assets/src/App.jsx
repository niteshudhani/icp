import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Memos from "./components/memos.component";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark" bg="primary">
          <ul className="nav justify-content-center">
            <li className="nav-item">
              <Link to={"/"} className="nav-link navbar-brand">Memos</Link>
            </li>
          </ul> 
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/memos"]} component={Memos} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
