import React, { Component } from "react";

import * as api from "../utils/api";
import ErrorDisplay from "./ErrorDisplay";

export default class CommentInput extends Component {
  state = {
    addedComment: false,
    addedCommentData: "",
    comment: "",
    hideCommentInput: true,
    submitCommentError: "",
  };

  componentDidUpdate(prevProps) {
    if (prevProps.article_id !== this.props.article_id) {
      this.setState({ addedComment: false });
    }
  }

  deleteAddedComment = (comment_id) => {
    api
      .deletecomment(comment_id)
      .then((data) =>
        this.setState({ addedComment: false, addedCommentData: "" })
      );
  };

  reloadComments = () => {
    this.props.reloadcommentsToggle();
  };

  handleDelete = (comment_id) => {
    this.deleteAddedComment(comment_id);
    this.setCommentState("");
  };

  handleEdit = (comment_id) => {
    this.deleteAddedComment(comment_id);
  };

  postComment = (article_id, user, comment, created_at) => {
    api
      .postcomment(article_id, user, comment, created_at)
      .then((data) => {
        this.setState({
          addedComment: true,
          addedCommentData: data,
          missingFields: false,
        });
      })
      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          submitCommentError: {
            status: status,
            msg: data.message,
          },
        });
        console.dir(error.response.data.message);
      });
  };
  toggleHideComment = () => {
    this.setState((state) => {
      const newHideCommentInput = !state.hideCommentInput;

      return { hideCommentInput: newHideCommentInput };
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { article_id, user } = this.props;
    const comment = this.state.comment;
    const created_at = new Date();
    if (comment) {
      this.postComment(article_id, user.username, comment, created_at);
    } else this.setState({ missingFields: true });
  };

  handleClear = (event) => {
    event.preventDefault();
    this.setCommentState("");
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setCommentState(event.target.value);
  };
  handleOk = (event) => {
    this.setState({ addedComment: false, comment: "" });
    this.reloadComments();
  };

  setCommentState = (comment) => {
    this.setState({ comment });
  };

  handleShowComment = () => {
    this.toggleHideComment();
  };

  render() {
    const { comment } = this.state.addedCommentData;
    const { hideCommentInput, submitCommentError, missingFields } = this.state;

    if (this.props.user.username === "Default")
      return <h4>Comment Input - Please login to add a comment</h4>;
    if (submitCommentError)
      return (
        <ErrorDisplay
          status={submitCommentError.status}
          msg={submitCommentError.msg}
        />
      );

    if (hideCommentInput)
      return (
        <h4>
          Comment Input <button onClick={this.handleShowComment}>on</button>
        </h4>
      );
    return (
      <main>
        <h4>
          Comment Input <button onClick={this.handleShowComment}>off</button>
        </h4>
        {this.state.addedComment ? (
          <div>
            {" "}
            <h4>Comment Added!</h4>
            <div key={comment.comment_id} className="commentsGrid">
              <span className="commentsGrid__Body">{comment.body}</span>

              <span className="commentsGrid__Created">
                Posted: {new Date(comment.created_at).toLocaleString()} By{" "}
                {comment.author}
              </span>
              <span className="commentsGrid__VoteButton">
                <button onClick={() => this.handleEdit(comment.comment_id)}>
                  Edit
                </button>
                <button onClick={() => this.handleDelete(comment.comment_id)}>
                  Delete
                </button>
                <button onClick={this.handleOk}>Ok</button>
              </span>
            </div>
          </div>
        ) : (
          <div className="commentInput">
            <h4>Add a Comment</h4>
            <form>
              <textarea
                rows="3"
                cols="65"
                value={this.state.comment}
                onChange={this.handleChange}
              ></textarea>
              <input
                name="submitButton"
                type="submit"
                value="Submit"
                onClick={this.handleSubmit}
              ></input>
              <button onClick={this.handleClear}>Clear</button>
            </form>
          </div>
        )}

        {missingFields ? (
          <div className="missingFields">Please add a comment!</div>
        ) : null}
      </main>
    );
  }
}
