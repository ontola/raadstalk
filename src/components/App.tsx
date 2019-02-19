import React from "react";

import { BrowserRouter, Link, Route } from "react-router-dom";
import About from "../views/About";
import Home from "../views/Home";
import List from "../views/List";
import Map from "../views/Map";

import "../styles/App.scss";

const App: React.FunctionComponent = () => (
  <BrowserRouter>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/list">List</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <div id="main-content" className="boundingBox">
        <Route exact path="/" component={Home} />
        <Route path="/list/:query" component={List} />
        <Route path="/map" component={Map} />
        <Route path="/about" component={About} />
        <footer><Link to="/about">Over deze app</Link> | Gemaakt met Open Raadsinformatie</footer>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
