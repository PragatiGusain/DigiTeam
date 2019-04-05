import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FontIcon from "material-ui/FontIcon";
import Avatar from "material-ui/Avatar";

import MainLayout from "./MainLayout";
import Home from "./Home";
import Loader from "./Loader";
import UserSelection from "./UserSelection";
import Chatroom from "./Chatroom";
import socket from "./socket";
import ChatRoom2 from "./ChatRoom2";
import NavBar from "./NavBar";

injectTapEventPlugin();

export default class Root extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: null,
      isRegisterInProcess: false,
      client: socket(),
      chatrooms: null
    };

    this.onEnterChatroom = this.onEnterChatroom.bind(this);
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this);
    this.getChatrooms = this.getChatrooms.bind(this);
    this.register = this.register.bind(this);
    this.renderUserSelectionOrRedirect = this.renderUserSelectionOrRedirect.bind(
      this
    );

    this.getChatrooms();
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    if (!this.state.user) return onNoUserSelected();

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err) return console.error(err);
      return onEnterSuccess(chatHistory);
    });
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, err => {
      if (err) return console.error(err);
      return onLeaveSuccess();
    });
  }

  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms });
    });
  }

  register(name) {
    const onRegisterResponse = user =>
      this.setState({ isRegisterInProcess: false, user });
    this.setState({ isRegisterInProcess: true });
    this.state.client.register(name, (err, user) => {
      if (err) return onRegisterResponse(null);
      return onRegisterResponse(user);
    });
  }

  renderUserSelectionOrRedirect(renderUserSelection) {
    if (this.state.user) {
      return <Redirect to="/" />;
    }

    return this.state.isRegisterInProcess ? <Loader /> : renderUserSelection();
  }

  renderChatroomOrRedirect(chatroom, { history }) {
    if (!this.state.user) {
      return <Redirect to="/" />;
    }

    const { chatHistory } = history.location.state;

    return (
      <ChatRoom2
        chatroom={chatroom}
        chatHistory={chatHistory}
        user={this.state.user}
        onLeave={() =>
          this.onLeaveChatroom(chatroom.name, () => history.push("/"))
        }
        onSendMessage={(message, cb) =>
          this.state.client.message(chatroom.name, message, cb)
        }
        registerHandler={this.state.client.registerHandler}
        unregisterHandler={this.state.client.unregisterHandler}
      />
      // <ChatRoom2 />
    );
  }

  renderAvatar(user) {
    const props = user
      ? { src: user.image }
      : {
          icon: (
            <FontIcon style={{ fontSize: 30 }} className="material-icons">
              {"perm_identity"}
            </FontIcon>
          )
        };

    return <Avatar size={30} {...props} />;
  }

  fullName(user) {
    return user ? `${user.name} ${user.lastName}` : "Who are you?";
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <NavBar
            user={this.fullName(this.state.user)}
            avatar={this.renderAvatar(this.renderAvatar(this.state.user))}
          />
          <MainLayout user={this.state.user} style={{ paddingTop: "50px" }}>
            {!this.state.chatrooms ? (
              <Loader />
            ) : (
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props => (
                    <Home
                      user={this.state.user}
                      chatrooms={this.state.chatrooms}
                      onChangeUser={() => props.history.push("/user")}
                      onEnterChatroom={chatroomName =>
                        this.onEnterChatroom(
                          chatroomName,
                          () => props.history.push("/user"),
                          chatHistory =>
                            props.history.push({
                              pathname: chatroomName,
                              state: { chatHistory }
                            })
                        )
                      }
                    />
                  )}
                />
                <Route
                  exact
                  path="/user"
                  render={props => {
                    const toHome = () => props.history.push("/");
                    return this.renderUserSelectionOrRedirect(() => (
                      <UserSelection
                        getAvailableUsers={this.state.client.getAvailableUsers}
                        close={toHome}
                        register={name => this.register(name, toHome)}
                      />
                    ));
                  }}
                />
                {this.state.chatrooms.map(chatroom => (
                  <Route
                    key={chatroom.name}
                    exact
                    path={`/${chatroom.name}`}
                    render={props =>
                      this.renderChatroomOrRedirect(chatroom, props)
                    }
                  />
                ))}
              </Switch>
            )}
          </MainLayout>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}
