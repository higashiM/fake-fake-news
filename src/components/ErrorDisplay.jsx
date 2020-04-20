import React from "react";

const ErrorDisplay = ({ status, msg }) => {
  return (
    <div>
      <h2>Oh No! Something has not worked</h2>
      Status: {status}
      Message: {msg}
    </div>
  );
};

export default ErrorDisplay;
