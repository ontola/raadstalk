import React from 'react';

import "../styles/Spinner.scss";

const Spinner: React.SFC = () => {
  return (
    <div className="Spinner">
      <div className="Spinner__rect1"></div>
      <div className="Spinner__rect2"></div>
      <div className="Spinner__rect3"></div>
      <div className="Spinner__rect4"></div>
      <div className="Spinner__rect5"></div>
    </div>
  );
};

export default Spinner;
