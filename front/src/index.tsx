import React from "react";
import ReactDom from "react-dom";
import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";

import App from "./components/App";

export const bugsnagClient = bugsnag({
  apiKey: "f211be19c66edc095b7cf397cfd73a57",
  releaseStage: process.env.NODE_ENV,
});
bugsnagClient.use(bugsnagReact, React);

const ErrorBoundary = bugsnagClient.getPlugin("react");

ReactDom.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("root"),
);

export default null;
