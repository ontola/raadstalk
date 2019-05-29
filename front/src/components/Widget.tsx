import React from "react";

import { Route, Switch } from "react-router-dom";
import About from "../views/About";
import Home from "../views/Home";
import List from "../views/List";
import Map from "../views/Map";

import "../styles/Widget.scss";

const App: React.FunctionComponent = () => (
  <div className="Widget">
    <Switch >
      <Route path="/widget" exact component={Home} />
      <Route path="/widget/list/:query" component={List} />
      <Route path="/widget/map/:query" component={Map} />
      <Route path="/widget/about" component={About} />
    </Switch>
    {/* Load the styling for the Leaflet map */}
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
  </div>
);

export default App;
