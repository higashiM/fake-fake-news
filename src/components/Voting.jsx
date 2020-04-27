import React, { Component } from "react";
import * as api from "../utils/api";
import ErrorDisplay from "./ErrorDisplay";

export default class Voting extends Component {
  state = { vote: null, votingError: null };

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.voteTargetId !== this.props.voteTargetId ||
      prevProps.username !== this.props.username
    )
      this.setState({ vote: null });
  };

  incrementArticleVote = (article_id, votevalue, username) => {
    api
      .addArticleVote(article_id, username, votevalue)
      .then((data) => {})
      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          votingError: {
            status: status,
            msg: data.message,
          },
        });
      });
  };

  incrementCommentVote = (comment_id, votevalue, username) => {
    api
      .addCommentVote(comment_id, username, votevalue)
      .then((data) => {})
      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          votingError: {
            status: status,
            msg: data.message,
          },
        });
      });
  };

  handleVote = (voteTargetId, voteTargetType, voteDirection, username) => {
    let voteValue = -1;
    if (voteDirection === "Up") voteValue = 1;

    if (!this.state.vote) {
      this.setState({ vote: voteValue });
      this.props.didVote(voteTargetId, voteValue);

      if (voteTargetType === "article") {
        this.incrementArticleVote(voteTargetId, voteValue, username);
      }
      if (voteTargetType === "comment") {
        this.incrementCommentVote(voteTargetId, voteValue, username);
      }
    }
  };

  thumbs = (value) => {
    return value === 1 ? (
      <span role="img" aria-label="thumbs-up">
        👍
      </span>
    ) : (
      <span role="img" aria-label="thumbs-down">
        👎
      </span>
    );
  };

  render() {
    const { voteTargetId, voteTargetType, username, uservotes } = this.props;
    const { votingError, vote } = this.state;

    if (!username || username === "Default") return null;
    if (uservotes[voteTargetId])
      return <>You Voted {this.thumbs(uservotes[voteTargetId])}</>;
    if (vote) return <>You Voted {this.thumbs(vote)}</>;

    if (votingError)
      return <ErrorDisplay status={votingError.status} msg={votingError.msg} />;

    return (
      <>
        <button
          className="thumbButton"
          onClick={() =>
            this.handleVote(voteTargetId, voteTargetType, "Up", username)
          }
        >
          {this.thumbs(1)}
        </button>
        {"or"}
        <button
          className="thumbButton"
          onClick={() =>
            this.handleVote(voteTargetId, voteTargetType, "Down", username)
          }
        >
          {this.thumbs(-1)}
        </button>
        {"?"}
      </>
    );
  }
}
