import React, { Component } from "react";
import * as func from "../utils/functions";
import * as api from "../utils/api";
import Loader from "./Loader";
export default class Comments extends Component {
  state = { comments: [], hideComments: true };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.loadPage();
    }
  }
  componentDidMount() {
    this.loadPage();
  }

  loadPage = () => {
    const params = { limit: "100" };
    api.getcomments(this.props.article_id, params).then((data) => {
      this.setState({
        comments: data.comments,
        isloading: false,
      });
    });
  };
  deleteComment = (comment_id) => {
    api.deletecomment(comment_id).then((data) => {
      this.loadPage();
    });
  };

  voteComment = (comment_id, vote) => {
    if (!this.props.user.commentVotes[comment_id]) {
      this.props.addCommentUserVotes(comment_id, vote);
      api.votecomment(comment_id, vote).then((data) => {
        this.loadPage();
      });
    }
  };

  toggleHideComment = () => {
    this.setState((state) => {
      const newHideComments = !state.hideComments;

      return { hideComments: newHideComments };
    });
  };

  handleDelete = (comment_id) => {
    this.deleteComment(comment_id);
  };

  handleUpVote = (comment_id) => {
    const vote = 1;
    this.voteComment(comment_id, vote);
  };

  handleDownVote = (comment_id) => {
    const vote = -1;
    this.voteComment(comment_id, vote);
  };

  handleShowComment = () => {
    this.toggleHideComment();
  };
  render() {
    const { comments, isloading, hideComments } = this.state;

    if (isloading) return <Loader />;

    return hideComments ? (
      <h4>
        Comments <button onClick={this.handleShowComment}>on</button>
      </h4>
    ) : (
      <main>
        <h4>
          Comments <button onClick={this.handleShowComment}>off</button>
        </h4>
        <div className="commentsWrapper">
          {comments.map((comment) => {
            const timeCreated = new Date(comment.created_at).getTime();
            const postedWhen = func.timeDiffString(timeCreated);

            return (
              <div key={comment.comment_id} className="commentsGrid">
                <span className="commentsGrid__Body">{comment.body}</span>
                <span className="commentsGrid__Votes">
                  Votes: {comment.votes}
                </span>
                <span className="commentsGrid__Created">
                  Posted {postedWhen} by {comment.author}
                </span>

                {comment.author === this.props.user.username ? (
                  <span className="commentsGrid__DeleteButton">
                    {" "}
                    <button
                      onClick={() => this.handleDelete(comment.comment_id)}
                    >
                      Delete!
                    </button>{" "}
                  </span>
                ) : !this.props.user.commentVotes[comment.comment_id] ? (
                  <span className="commentsGrid__VoteButton">
                    {" "}
                    <button
                      onClick={() => this.handleUpVote(comment.comment_id)}
                    >
                      +Vote
                    </button>{" "}
                    <button
                      onClick={() => this.handleDownVote(comment.comment_id)}
                    >
                      -Vote
                    </button>{" "}
                  </span>
                ) : (
                  <span className="commentsGrid__VoteButton">
                    you voted{" "}
                    {this.props.user.commentVotes[comment.comment_id] === 1
                      ? "+"
                      : "-"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </main>
    );
  }
}
