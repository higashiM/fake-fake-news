import React from "react";

import "./styles/App.css";
import MainDisplay from "./components/MainDisplay";
import LogIn from "./components/LogIn";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SubDisplay from "./components/SubDisplay";
import Header from "./components/Header";

class App extends React.Component {
  state = {
    user: {
      username: "Default",
    },
    newTopic: "",
  };
  setNewTopic = (newTopic) => {
    this.setState({ newTopic });
  };

  setUser = (user) => {
    const newUser = { ...user, commentVotes: {}, articleVotes: {} };

    this.setState({ user: newUser });
  };

  render() {
    return (
      <div className="app">
        <NavBar newTopic={this.state.newTopic}></NavBar>
        <Header></Header>
        <MainDisplay>user={this.state.user}</MainDisplay>
        <LogIn setUser={this.setUser} loggedinuser={this.state.user}></LogIn>
        <SubDisplay
          user={this.state.user}
          setNewTopic={this.setNewTopic}
        ></SubDisplay>

        <Footer></Footer>
      </div>
    );
  }
}

export default App;
