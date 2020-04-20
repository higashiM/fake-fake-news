import React, { Component } from "react";
import * as api from "../utils/api";
export default class ArticleDisplay extends Component {
  state = { vote: 0 };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({ vote: 0 });
    }
  }
  deleteArticle = (article_id) => {
    api.deletearticle(article_id).then((data) => {
      this.props.articleDeletedToggle(true);
    });
  };

  voteArticle = (article_id, vote) => {
    if (!this.props.user.articleVotes[article_id]) {
      this.props.addArticleUserVotes(article_id, vote);
      api.votearticle(article_id, vote).then(() => {
        this.setState({ vote });
      });
    }
  };
  handleUpVote = (article_id) => {
    const vote = 1;
    this.voteArticle(article_id, vote);
  };

  handleDownVote = (article_id) => {
    const vote = -1;
    this.voteArticle(article_id, vote);
  };

  handleDelete = (article_id) => {
    this.deleteArticle(article_id);
  };
  render() {
    const article = this.props.article;
    return (
      <div>
        {article.image_url ? (
          <img
            className="mainArticleGrid__Image"
            src={article.image_url}
            alt=""
            height="200px"
          ></img>
        ) : null}
        <div className="mainArticleGrid">
          <span className="mainArticleGrid__Title">{article.title}</span>
          <span className="mainArticleGrid__Topic">Topic: {article.topic}</span>

          <span className="mainArticleGrid__Created">
            Posted: {new Date(article.created_at).toLocaleString()} By{" "}
            {article.author}
          </span>
          <span className="mainArticleGrid__Body">{article.body}</span>
          <span className="mainArticleGrid__Votes">
            Votes: {article.votes + this.state.vote}
          </span>

          {article.author !== this.props.user.username ? (
            !this.props.user.articleVotes[article.article_id] ? (
              <span className="mainArticleGrid__VoteButton">
                {" "}
                <button onClick={() => this.handleUpVote(article.article_id)}>
                  +Vote
                </button>{" "}
                <button onClick={() => this.handleDownVote(article.article_id)}>
                  -Vote
                </button>{" "}
              </span>
            ) : (
              <span className="mainArticleGrid__VoteButton">
                you voted{" "}
                {this.props.user.articleVotes[article.article_id] === 1
                  ? "+"
                  : "-"}
              </span>
            )
          ) : (
            <span className="mainArticleGrid__DeleteButton">
              <button onClick={() => this.handleDelete(article.article_id)}>
                Delete!
              </button>{" "}
            </span>
          )}
        </div>
      </div>
    );
  }
}
