import React, { Component } from "react";
import * as api from "../utils/api";
import * as func from "../utils/functions";
import Voting from "./Voting";
import Loader from "./Loader";
export default class ArticleDisplay extends Component {
  state = { userVotes: "", newVotes: {}, isloading: true };

  componentDidMount() {
    this.getArticleVotes(this.props.user.username);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user !== prevProps.user) {
      this.getArticleVotes(this.props.user.username);
    }
  }
  getArticleVotes = (username) => {
    api.getUserArticleVotes(username).then((data) => {
      if (data.votes.length > 0) {
        const lookup = func.userVoteTransform(data.votes);
        this.setState({ userVotes: lookup, newVotes: {}, isloading: false });
      } else this.setState({ newVotes: {}, isloading: false });
    });
  };

  didVote = (id, value) => {
    const newVotes = { [id]: value };
    this.setState({ newVotes });
  };
  deleteArticle = (article_id) => {
    api.deletearticle(article_id).then((data) => {
      this.props.articleDeletedToggle(true);
    });
  };

  handleDelete = (article_id) => {
    this.deleteArticle(article_id);
  };

  render() {
    const article = this.props.article;
    const username = this.props.user.username;
    const { newVotes, userVotes, isloading } = this.state;

    return (
      <div className="mainArticleGrid">
        {article.image_url ? (
          <img
            className="mainArticleGrid__Image"
            src={article.image_url}
            alt=""
          ></img>
        ) : null}
        <span className="mainArticleGrid__Title">{article.title}</span>
        <span className="mainArticleGrid__Topic">Topic: {article.topic}</span>

        <span className="mainArticleGrid__Created">
          Posted: {new Date(article.created_at).toLocaleString()} By{" "}
          {article.author}
        </span>
        <span className="mainArticleGrid__Body">{article.body}</span>
        <span className="mainArticleGrid__Votes">
          {newVotes[article.article_id]
            ? func.faces(article.votes + newVotes[article.article_id])
            : func.faces(article.votes)}
        </span>

        {article.author !== username ? (
          isloading ? (
            <Loader />
          ) : (
            <span className="mainArticleGrid__VoteButton">
              <Voting
                didVote={this.didVote}
                uservotes={userVotes}
                voteTargetId={article.article_id}
                voteTargetType="article"
                username={username}
              ></Voting>
            </span>
          )
        ) : (
          <span className="mainArticleGrid__DeleteButton">
            <button
              className="deleteButton"
              onClick={() => this.handleDelete(article.article_id)}
            >
              Delete!
            </button>{" "}
          </span>
        )}
      </div>
    );
  }
}
