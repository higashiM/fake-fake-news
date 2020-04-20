import React from "react";

import "./styles/App.css";
import MainDisplay from "./components/MainDisplay";
import LogIn from "./components/LogIn";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SubDisplay from "./components/SubDisplay";
import { Header } from "./components/Header";

class App extends React.Component {
  state = {
    user: {
      username: "Default",
      commentVotes: "",
      articleVotes: {},
      newTopic: "",
    },
  };
  setNewTopic = (newTopic) => {
    this.setState({ newTopic });
  };

  setUser = (user) => {
    const newUser = { ...user, commentVotes: {}, articleVotes: {} };

    this.setState({ user: newUser });
  };

  addCommentUserVotes = (comment_id, voteDirection) => {
    console.log(this.state);
    this.setState((state) => {
      const newVotes = {
        ...state.user.commentVotes,
        [comment_id]: voteDirection,
      };

      const newUser = {
        ...state.user,
        commentVotes: newVotes,
      };

      return { user: newUser };
    });
  };

  addArticleUserVotes = (article_id, voteDirection) => {
    this.setState((state) => {
      const newVotes = {
        ...state.user.articleVotes,
        [article_id]: voteDirection,
      };

      const newUser = {
        ...state.user,
        articleVotes: newVotes,
      };

      return { user: newUser };
    });
  };

  render() {
    return (
      <div className="app">
        <NavBar newTopic={this.state.newTopic}></NavBar>
        <Header></Header>
        <MainDisplay>
          addArticleUserVotes={this.addArticleUserVotes}
          user={this.state.user}
        </MainDisplay>
        <LogIn setUser={this.setUser} loggedinuser={this.state.user}></LogIn>
        <SubDisplay
          user={this.state.user}
          setNewTopic={this.setNewTopic}
          addCommentUserVotes={this.addCommentUserVotes}
          addArticleUserVotes={this.addArticleUserVotes}
        ></SubDisplay>

        <Footer></Footer>
      </div>
    );
  }
}

export default App;
