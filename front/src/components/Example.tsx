import React from "react";

import "../styles/Example.scss";

const Example: React.FunctionComponent = () => (
  <div className="Example">
    <div className="Example__wrapper">
    <iframe
      src={`${window.location.origin}/widget`}
      height="100%"
      width="100%"
      frameBorder="0"
      scrolling="no"
    >
      <p>
        Raadstalk kan niet worden geladen.
        Bezoek <a href="http://raadstalk.nl">raadstalk.nl</a>
      </p>
    </iframe>
    </div>
  </div>
);

export default Example;
