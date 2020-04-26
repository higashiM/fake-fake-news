import React from "react";
import { Router } from "@reach/router";
import Articles from "./Articles";
import ErrorDisplay from "./ErrorDisplay";

export const MainDisplay = () => {
  return (
    <div className="main-section">
      {" "}
      <Router>
        <Articles path="/authors/:author/topics/:topic"></Articles>
        <Articles path="/authors/:author/topics/:topic/:article_id"></Articles>
        <Articles path="/"> </Articles>
        <ErrorDisplay default status={404} msg="Page not Found"></ErrorDisplay>
      </Router>
    </div>
  );
};
export default MainDisplay;
