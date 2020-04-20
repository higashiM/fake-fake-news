import React, { Component } from "react";
import { Link } from "@reach/router";
import { Listbox, ListboxOption } from "@reach/listbox";
import * as api from "../utils/api";
import "@reach/listbox/styles.css";
import { Menu, MenuList, MenuButton, MenuLink } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import Loader from "./Loader";
export default class LogIn extends Component {
  state = { user: "", isloading: true };

  setValue = (value) => {
    if (value !== "select a user") {
      this.setState({ user: value });
      this.loaduser(value);
    }
  };

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    api.getusers().then((data) => {
      const users = data.users;

      this.setState({ users, isloading: false });
    });
  };

  loaduser = (user) => {
    api.getuser(user).then((data) => {
      this.props.setUser(data.user);
    });
  };

  render() {
    const { users, isloading } = this.state;
    const { loggedinuser } = this.props;
    if (isloading) return <Loader></Loader>;

    return (
      <span className="user__login">
        <span className="user__avatar">
          {loggedinuser.avatar_url ? (
            <img src={loggedinuser.avatar_url} height="30px" alt="user"></img>
          ) : (
            <span role="img" aria-label="Bust Silhouette">
              👤{" "}
            </span>
          )}
        </span>
        <span className="user__select">
          <Listbox
            aria-labelledby="my-label"
            value={this.state.value}
            onChange={this.setValue}
          >
            <ListboxOption key={"select a user"} value={"select a user"}>
              select a user
            </ListboxOption>

            {users.map((user) => {
              return (
                <ListboxOption key={user.username} value={user.username}>
                  {user.username}
                </ListboxOption>
              );
            })}
          </Listbox>
        </span>
        <span className="user__options">
          <Menu>
            <MenuButton>add new article</MenuButton>
            <MenuList>
              <MenuLink
                as={Link}
                to={`/addnewarticle`}
                //onSelect={() => this.updateUsersButton("all")}
              >
                add new article
              </MenuLink>
            </MenuList>
          </Menu>
        </span>
      </span>
    );
  }
}
