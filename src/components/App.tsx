import React from "react";

import { BrowserRouter, Link, Route } from "react-router-dom";
import About from "../views/About";
import Home from "../views/Home";
import List from "../views/List";
import Map from "../views/Map";

import "../styles/App.scss";

const App: React.FunctionComponent = () => (
  <BrowserRouter>
    <div id="main-content" className="boundingBox">
      <Route exact path="/" component={Home} />
      <Route path="/list/:query" component={List} />
      <Route path="/map/:query" component={Map} />
      <Route path="/about" component={About} />
      <footer><Link to="/about">Over deze app</Link> | Gemaakt met Open Raadsinformatie</footer>
    </div>
  </BrowserRouter>
);

export default App;
