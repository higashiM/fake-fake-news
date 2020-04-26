import React, { Component } from "react";
import { navigate } from "@reach/router";
import * as api from "../utils/api";
import Loader from "./Loader";
import ErrorDisplay from "./ErrorDisplay";
import ArticleDisplay from "./ArticleDisplay";
export default class ArticleInput extends Component {
  componentDidMount = () => {
    this.articleDeletedToggle(false);
    this.loadTopics();
  };

  state = {
    addedArticle: false,
    addedArticleData: "",
    title: "",
    body: "",
    topic: "",
    image_url: "",
    topics: "",
    isloading: true,
    submitArticleError: null,
    isDeleted: false,
    missingFields: false,
  };

  articleDeletedToggle = (isDeleted) => {
    this.setState({ isDeleted });
  };

  loadTopics = () => {
    api.gettopics().then((data) => {
      const topics = data.topics;

      this.setState({ topics, isloading: false });
    });
  };

  postTopicArticle = (topic, article) => {
    api
      .addtopic(topic)
      .then(() => this.props.setNewTopic(topic.slug))

      .then(() => this.postArticle(article))
      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          submitArticleError: {
            status: status,
            msg: data.message,
          },
        });
        console.dir(error);
      });
  };

  postArticle = (article) => {
    api
      .addarticle(article)
      .then((data) => {
        this.setState({
          addedArticle: true,
          addedArticleData: data.article,
          submitArticleError: null,
          missingFields: false,
        });
      })
      .then(() =>
        navigate(
          `/authors/All/topics/All/${this.state.addedArticleData.article_id}`
        )
      )

      .catch((error) => {
        const { status, data } = error.response;
        this.setState({
          submitArticleError: {
            status: status,
            msg: data.message,
          },
        });
        console.dir(error.response.data.message);
      });
  };

  clearInput = () => {
    this.setState({
      isDeleted: false,
      addedArticle: false,
      title: "",
      body: "",
      topic: "",
      image_url: "",
      missingFields: false,
      newTopicSlug: "",
      newTopicDesc: "",
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { title, body, image_url, newTopicDesc, newTopicSlug } = this.state;
    const created_at = new Date();

    const topic = newTopicSlug || this.state.topic;

    const article = {
      author: this.props.user.username,
      title,
      body,
      topic,
      image_url,
      created_at,
    };

    const newTopic = { slug: newTopicSlug, description: newTopicDesc };

    if (title && body && newTopicDesc && newTopicSlug)
      this.postTopicArticle(newTopic, article);
    else if (title && body && topic) this.postArticle(article);
    else this.setState({ missingFields: true });
  };
  handleChange = (event) => {
    event.preventDefault();

    if (event.target.name === "topic") {
      this.setState({
        [event.target.name]: event.target.value,
        newTopicSlug: "",
        newTopicDesc: "",
      });
    } else
      this.setState({
        [event.target.name]: event.target.value,
      });
  };

  handleClear = () => {
    this.clearInput();
  };
  render() {
    const {
      topics,
      isloading,
      submitArticleError,
      addedArticle,
      addedArticleData,
      isDeleted,
      missingFields,
    } = this.state;

    if (this.props.user.username === "Default")
      return (
        <ErrorDisplay status={400} msg={"Please login to add an article"} />
      );

    if (isloading) return <Loader></Loader>;
    if (isDeleted)
      return (
        <div>
          {" "}
          This article has been deleted! Please select another article{" "}
          <button onClick={this.handleClear}>Ok</button>
        </div>
      );
    if (submitArticleError)
      return (
        <ErrorDisplay
          status={submitArticleError.status}
          msg={submitArticleError.msg}
        />
      );

    if (addedArticle)
      return (
        <div>
          {" "}
          <h4>Article Added:</h4>
          <ArticleDisplay
            articleDeletedToggle={this.articleDeletedToggle}
            article={addedArticleData}
            user={this.props.user}
          ></ArticleDisplay>
        </div>
      );
    return (
      <div className="addArticle">
        <form className="articleInput__form">
          <div className="articleInput__title">
            <div> Article Title (required)</div>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            ></input>
          </div>
          <div className="articleInput__topic">
            Article Topic (required)
            <div>
              <select type="text" name="topic" onChange={this.handleChange}>
                <option value="">Select a topic</option>;
                {topics.map((topic) => {
                  return (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.slug}
                    </option>
                  );
                })}
              </select>{" "}
              or add a new one:
            </div>
          </div>
          <div className="articleInput__newTopicSlug">
            <input
              disabled={this.state.topic}
              placeholder="topic slug e.g. 'coding'"
              type="text"
              name="newTopicSlug"
              value={this.state.newTopicSlug}
              onChange={this.handleChange}
            ></input>
          </div>
          <div className="articleInput__newTopicDesc">
            <textarea
              disabled={this.state.topic}
              placeholder="topic description"
              rows="2"
              cols="60"
              type="text"
              name="newTopicDesc"
              value={this.state.newTopicDesc}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="articleInput__body">
            <div>Article Text (required)</div>
            <textarea
              name="body"
              rows="3"
              cols="60"
              value={this.state.body}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="articleInput__image">
            Image url (optional)
            <input
              type="url"
              name="image_url"
              value={this.state.image_url}
              onChange={this.handleChange}
            ></input>
          </div>
          <div className="articleInput__submitButton">
            <input
              name="submitButton"
              type="submit"
              value="Submit"
              onClick={this.handleSubmit}
            ></input>
          </div>
          <div className="articleInput__clearButton">
            <button onClick={this.handleClear}>Clear</button>
          </div>
          <div className="articleInput__previewimage">
            Image Preview{" "}
            <div>
              <img src={this.state.image_url} alt="preview" height="200px" />
            </div>
          </div>
        </form>
        {missingFields ? <div>Please fill in all required Fields!</div> : null}
      </div>
    );
  }
}
