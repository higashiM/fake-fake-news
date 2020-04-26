import React, { Component } from "react";
import * as api from "../utils/api";
import CommentInput from "./CommentInput";
import Comments from "./Comments";
import Loader from "./Loader";
import ErrorDisplay from "./ErrorDisplay";
import ArticleDisplay from "./ArticleDisplay";

export default class ArticleCard extends Component {
  state = {
    article: [],
    isloading: true,
    isDeleted: false,
    articleError: null,
  };
  articleDeletedToggle = (isDeleted) => {
    this.setState({ isDeleted });
  };

  componentDidMount() {
    if (this.props.article_id) {
      this.loadPage();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.article_id !== this.props.article_id) {
      if (this.props.article_id) {
        this.setState({ isloading: true }, () => this.loadPage());
      }
    }
  }
  loadPage = () => {
    const article_id = this.props.article_id;
    const params = { article_id };
    //window.scrollTo(0, 0);
    api
      .getarticles(params)
      .then((data) => {
        this.setState({
          article: data.articles[0],
          isloading: false,
          isDeleted: false,
          articleError: null,
        });
      })
      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          articleError: {
            status: status,
            msg: data.message,
          },
        });
      });
  };

  reloadcommentsToggle = () => {
    const reloadComments = !this.state.reloadComments;

    this.setState({ reloadComments });
  };

  render() {
    const { article, isloading, isDeleted, articleError } = this.state;

    if (!this.props.article_id) return <div>please select an article</div>;
    if (isDeleted)
      return (
        <div>
          {" "}
          This article has been deleted! Please select another article{" "}
        </div>
      );
    if (articleError)
      return (
        <ErrorDisplay status={articleError.status} msg={articleError.msg} />
      );
    if (isloading) return <Loader />;

    return (
      <main>
        <ArticleDisplay
          user={this.props.user}
          article={article}
          articleDeletedToggle={this.articleDeletedToggle}
        ></ArticleDisplay>

        <CommentInput
          user={this.props.user}
          article_id={this.props.article_id}
          reloadcommentsToggle={this.reloadcommentsToggle}
        ></CommentInput>

        <Comments
          commentCount={this.state.article.comment_count}
          user={this.props.user}
          article_id={this.props.article_id}
        ></Comments>
      </main>
    );
  }
}
