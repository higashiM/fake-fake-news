import { Router } from "@reach/router";
import Articles from "./Articles";
import ErrorDisplay from "./ErrorDisplay";

import React, { Component } from "react";

export default class MainDisplay extends Component {
  render() {
    return (
      <div className="main-section">
        {" "}
        <Router>
          <Articles path="/authors/:author/topics/:topic" />
          <Articles path="/authors/:author/topics/:topic/:article_id" />
          <Articles path="/" />
          <ErrorDisplay default status={404} msg="Page not Found" />
        </Router>
      </div>
    );
  }
}
