import React, { Component } from "react";
import { Router } from "@reach/router";
import ArticleCard from "./ArticleCard";
import ArticleInput from "./ArticleInput";

export default class SubDisplay extends Component {
  render() {
    return (
      <div className="sub-section">
        {" "}
        <Router>
          <ArticleCard
            user={this.props.user}
            path={"authors/:author/topics/:topic/:article_id"}
          ></ArticleCard>

          <ArticleCard
            user={this.props.user}
            path={"authors/:author/topics/:topic/"}
          ></ArticleCard>

          <ArticleCard user={this.props.user} path={"/"}></ArticleCard>

          <ArticleInput
            setNewTopic={this.props.setNewTopic}
            user={this.props.user}
            path={"/addnewarticle"}
          ></ArticleInput>
        </Router>
      </div>
    );
  }
}
