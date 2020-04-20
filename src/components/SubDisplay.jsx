import React, { Component } from "react";
import { Router } from "@reach/router";
import ArticleCard from "./ArticleCard";

import ArticleInput from "./ArticleInput";

export default class SubDisplay extends Component {
  state = {
    addedComment: false,
    comment: "",
    reloadComments: false,
    isDeleted: false,
  };

  componentDidUpdate(prevState) {}

  render() {
    return (
      <div className="sub-section">
        {" "}
        <Router>
          <ArticleCard
            isDeleted={this.state.isDeleted}
            articleDeletedToggle={this.articleDeletedToggle}
            addArticleUserVotes={this.props.addArticleUserVotes}
            addCommentUserVotes={this.props.addCommentUserVotes}
            user={this.props.user}
            path={"authors/:author/topics/:topic/:article_id"}
          ></ArticleCard>

          <ArticleCard
            isDeleted={this.state.isDeleted}
            articleDeletedToggle={this.articleDeletedToggle}
            addArticleUserVotes={this.props.addArticleUserVotes}
            addCommentUserVotes={this.props.addCommentUserVotes}
            user={this.props.user}
            path={"authors/:author/topics/:topic/"}
          ></ArticleCard>

          <ArticleCard
            isDeleted={this.state.isDeleted}
            articleDeletedToggle={this.articleDeletedToggle}
            addArticleUserVotes={this.props.addArticleUserVotes}
            addCommentUserVotes={this.props.addCommentUserVotes}
            user={this.props.user}
            path={"/"}
          ></ArticleCard>

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
