import React, { Component } from "react";
import * as func from "../utils/functions";
import * as api from "../utils/api";
import Loader from "./Loader";
import Voting from "./Voting";
export default class Comments extends Component {
  state = {
    userVotes: "",
    newVotes: {},
    comments: [],
    commentsError: null,
    limit: 5,
    maxPageLimit: 5,
    p: 1,
    maxPage: 1,
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.article_id !== prevProps.article_id) this.setPageParams();
  }

  setPageParams = () => {
    const maxPage = Math.floor(this.props.commentCount / this.state.limit);
    const maxPageLimit =
      (this.props.commentCount % this.state.limit) + this.state.limit;

    this.setState({ p: 1, maxPage, maxPageLimit, isloading: true }, () => {
      this.loadPage();
    });
  };

  componentDidMount() {
    this.setPageParams();
  }

  onScroll = (e) => {
    const { p, maxPage } = this.state;

    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    const top = e.target.scrollTop === 0;

    if (bottom) {
      const newP = Math.max(Math.min(p + 1, maxPage), 1);

      if (p !== newP) {
        this.setState({ p: newP }, () => this.loadPage());

        e.target.scrollTop = 5;
      }
    }
    if (top) {
      const newP = Math.max(Math.min(p - 1, maxPage), 1);

      if (p !== newP) {
        this.setState({ p: newP }, () => this.loadPage());

        e.target.scrollTop = e.target.scrollHeight - e.target.clientHeight - 5;
      }
    }
  };

  loadPage = () => {
    const username = this.props.user.username;
    let newlimit = this.state.limit;
    const { p, maxPage, maxPageLimit } = this.state;
    if (p === maxPage) newlimit = maxPageLimit;

    const params = { limit: newlimit, p };

    Promise.all([
      api.getcomments(this.props.article_id, params),
      api.getUserCommentVotes(username),
    ])
      .then(([comData, voteData]) => {
        let lookup = "";
        if (voteData.votes.length > 0)
          lookup = func.userVoteTransform(voteData.votes);
        this.setState({
          comments: comData.comments,
          isloading: false,
          p: p,
          userVotes: lookup,
          newVotes: {},
        });
      })
      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          commentsError: {
            status: status,
            msg: data.message,
          },
        });
        console.dir(error.response.data.message);
      });
  };

  deleteComment = (comment_id) => {
    api.deletecomment(comment_id).then((data) => {
      this.loadPage();
    });
  };

  handleDelete = (comment_id) => {
    this.deleteComment(comment_id);
  };

  handleShowComment = () => {
    this.toggleHideComment();
  };

  didVote = (id, value) => {
    this.setState((state) => {
      const votes = {
        ...state.newVotes,
        [id]: value,
      };

      return { newVotes: votes };
    });
  };

  render() {
    const username = this.props.user.username;
    const { comments, isloading, newVotes, userVotes } = this.state;

    if (isloading) return <Loader />;

    return (
      <main>
        <h4>Comments</h4>
        <div
          className="commentsWrapper"
          style={{
            height: "300px",
            overflow: "scroll",
          }}
          onScroll={this.onScroll}
        >
          {comments.map((comment) => {
            const timeCreated = new Date(comment.created_at).getTime();
            const postedWhen = func.timeDiffString(timeCreated);

            return (
              <div key={comment.comment_id} className="commentsGrid">
                <span className="commentsGrid__Body">{comment.body}</span>
                <span className="commentsGrid__Votes">
                  {newVotes[comment.comment_id]
                    ? func.faces(comment.votes + newVotes[comment.comment_id])
                    : func.faces(comment.votes)}
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
                ) : (
                  <span className="commentsGrid__VoteButton">
                    <Voting
                      didVote={this.didVote}
                      uservotes={userVotes}
                      voteTargetId={comment.comment_id}
                      voteTargetType="comment"
                      username={username}
                    ></Voting>
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
