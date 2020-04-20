import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import * as api from "../utils/api";
import { Menu, MenuList, MenuButton, MenuLink } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import Loader from "./Loader";

export default class NavBar extends Component {
  componentDidMount = () => {
    this.loadTopics();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.newTopic !== this.props.newTopic) {
      this.loadTopics();
    }
  };

  state = {
    topic: "all",
    topics: "",
    isloading: true,
    user: "all",
    users: "",
  };

  loadTopics = () => {
    api
      .gettopics()
      .then((data) => {
        const topics = data.topics;

        this.setState({ topics });
      })
      .then(() => this.loadUsers());
  };

  loadUsers = () => {
    api.getusers().then((data) => {
      const users = data.users;

      this.setState({ users, isloading: false });
    });
  };

  updateTopicsButton = (topic) => {
    this.setState({ topic });
  };

  updateUsersButton = (user) => {
    this.setState({ user });
  };

  removeTopicsFilter = () => {
    const topic = "all";
    this.setState({ topic });
    navigate(`/authors/${this.state.user}/topics/${topic}`);
  };

  removeUsersFilter = () => {
    const user = "all";
    this.setState({ user });
    navigate(`/authors/${user}/topics/${this.state.topic}`);
  };

  render() {
    const { topic, topics, user, users, isloading } = this.state;

    return isloading ? (
      <Loader />
    ) : (
      <main className="nav">
        <Menu>
          <MenuButton>Topic Filter: {topic}</MenuButton>
          <MenuList>
            <MenuLink
              as={Link}
              to={`/authors/${user}/topics/all`}
              onSelect={() => this.updateTopicsButton("all")}
            >
              all
            </MenuLink>
            {topics.map((topic) => {
              return (
                <MenuLink
                  key={topic.slug}
                  as={Link}
                  to={`authors/${user}/topics/${topic.slug}`}
                  onSelect={() => {
                    this.updateTopicsButton(topic.slug);
                  }}
                >
                  {topic.slug}
                </MenuLink>
              );
            })}
          </MenuList>
        </Menu>
        <button onClick={() => this.removeTopicsFilter()}>x</button>
        <Menu>
          <MenuButton>Author Filter: {user}</MenuButton>
          <MenuList>
            <MenuLink
              as={Link}
              to={`/authors/all/topics/${topic}`}
              onSelect={() => this.updateUsersButton("all")}
            >
              all
            </MenuLink>
            {users.map((user) => {
              return (
                <MenuLink
                  key={user.username}
                  as={Link}
                  to={`/authors/${user.username}/topics/${topic}`}
                  onSelect={() => {
                    this.updateUsersButton(user.username);
                  }}
                >
                  {user.username}
                </MenuLink>
              );
            })}
          </MenuList>
        </Menu>
        <button onClick={() => this.removeUsersFilter()}>x</button>
      </main>
    );
  }
}
