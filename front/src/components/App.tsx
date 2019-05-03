import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Widget from "./Widget";
import Example from "./Example";

import "../styles/reset.scss";
import "../styles/App.scss";

const App: React.FunctionComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Example} />
      <Route path="/widget" component={Widget} />
    </Switch>
  </BrowserRouter>
);

export default App;
