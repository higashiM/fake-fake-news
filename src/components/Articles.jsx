import React, { Component } from "react";
import { navigate } from "@reach/router";
import * as api from "../utils/api";
import * as func from "../utils/functions";
//import * as gqlapi from "../utils/gqlapi";
import { Link } from "@reach/router";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import Loader from "./Loader";
import ErrorDisplay from "./ErrorDisplay";

export default class Articles extends Component {
  state = {
    articleError: null,
    articles: [],
    selectedArticle: 0,
    sortButton: "Sort By",
    sort_by: "",
    limit: 10,
    p: 1,
    maxPage: "",
    total_count: "",
  };

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.author !== prevProps.author) |
      (this.props.topic !== prevProps.topic)
    ) {
      this.setState({ p: 1 }, () => this.loadPage());
    }

    if (this.props.article_id !== prevProps.article_id)
      this.setState({ selectedArticle: this.props.article_id }, () =>
        this.loadPage()
      );
  }

  loadPage = () => {
    let { topic, author } = this.props;
    const { sort_by, limit, p } = this.state;
    let order = "";

    if ((topic === "all") | (topic === "All") | !topic) topic = "";
    if ((author === "all") | (author === "All") | !author) author = "";
    if (sort_by === "title" || sort_by === "topic") order = "asc";
    const params = { topic, author, sort_by, limit, p, order };

    api
      .getarticles(params)
      .then((data) => {
        const selectedArticle = !this.props.article_id
          ? 0
          : this.props.article_id;

        const maxPage = Math.ceil(data.total_count / this.state.limit);
        this.setState({
          articles: data.articles,
          isloading: false,
          selectedArticle: selectedArticle,
          articleError: null,
          total_count: data.total_count,
          maxPage: maxPage,
        });
      })
      .then(() => {
        if (this.state.selectedArticle === 0)
          navigate(
            `/authors/All/topics/All/${this.state.articles[0].article_id}`
          );
      })

      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          articleError: {
            status: status,
            msg: data.message,
          },
        });
        console.dir(error.response.data.message);
      });
  };

  setSort = (sort_by, sortButton) => {
    this.setState({ sort_by, sortButton }, () => this.loadPage());
  };

  setPage = (p) => {
    const newp = Math.min(Math.max(this.state.p + p, 1), this.state.maxPage);

    this.setState({ p: newp }, () => this.loadPage());
  };

  handlePrevPage = () => {
    this.setPage(-1);
  };
  handleNextPage = () => {
    this.setPage(1);
  };

  render() {
    const {
      articles,
      isloading,
      selectedArticle,
      sortButton,
      articleError,
      p,
      maxPage,
    } = this.state;

    const author = this.props.author || "All";
    const topic = this.props.topic || "All";

    if (articleError)
      return (
        <ErrorDisplay status={articleError.status} msg={articleError.msg} />
      );
    if (isloading) return <Loader />;
    return (
      <main className="articlesWrapper">
        <span>
          Page {p} of {maxPage}
          <button className="page__button" onClick={this.handlePrevPage}>
            <span role="img" aria-labelledby="rewind">
              ⏪
            </span>
          </button>
          <span></span>
          <button className="page__button" onClick={this.handleNextPage}>
            <span role="img" aria-labelledby="fastforward">
              ⏩
            </span>
          </button>
        </span>
        <div>
          <Menu>
            <MenuButton>{sortButton}</MenuButton>
            <MenuList>
              <MenuItem
                onSelect={() =>
                  this.setSort("created_at", "Sorted by: Date Posted")
                }
              >
                {" "}
                date posted
              </MenuItem>
              <MenuItem
                onSelect={() =>
                  this.setSort("comment_count", "Sorted by: Comments")
                }
              >
                {" "}
                number of comments
              </MenuItem>
              <MenuItem
                onSelect={() => this.setSort("votes", "Sorted by: Votes")}
              >
                {" "}
                number of votes
              </MenuItem>
              <MenuItem
                onSelect={() => this.setSort("title", "Sorted by: Title")}
              >
                {" "}
                title
              </MenuItem>
              <MenuItem
                onSelect={() => this.setSort("topic", "Sorted by: Topic")}
              >
                {" "}
                topic
              </MenuItem>
            </MenuList>
          </Menu>
          <button onClick={() => this.setSort("", "Sort by")}>x</button>
        </div>
        {articles.map((article) => {
          const timeCreated = new Date(article.created_at).getTime();
          const postedWhen = func.timeDiffString(timeCreated);

          return (
            <Link
              className="articlesLink"
              to={`/authors/${author}/topics/${topic}/${article.article_id}`}
              key={article.article_id}
            >
              <div
                className={
                  article.article_id.toString() === selectedArticle.toString()
                    ? "articlesGrid__Selected"
                    : "articlesGrid"
                }
              >
                <span className="articlesGrid__Author">{article.author}</span>
                <span className="articlesGrid__Title">{article.title}</span>
                <span className="articlesGrid__Created">
                  {postedWhen} in {article.topic}
                </span>
                <span className="articlesGrid__Comments">
                  <span role="img" aria-label="speech bubble">
                    💬
                  </span>{" "}
                  {article.comment_count}
                </span>
                <span className="articlesGrid__Votes">
                  {" "}
                  {article.votes > 0 ? (
                    <span role="img" aria-label="Smiley face">
                      😊
                    </span>
                  ) : (
                    <span role="img" aria-label="Sad face">
                      😢
                    </span>
                  )}{" "}
                  {article.votes}
                </span>
              </div>
            </Link>
          );
        })}
      </main>
    );
  }
}
