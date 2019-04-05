import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = styled.div`
  height: 50px;
  position: relative;
  background: #fff;
  padding: 8px;
  width: 100%;
  z-index: 10;
  line-height: 50px;
`;

const HeaderLogo = styled.div`
  bottom: 0;
  display: block;
  height: 30px;
  left: 50%;
  margin-left: -40px;
  opacity: 0.5;
  position: absolute;
  top: 5px;
  width: 80px;
  text-align: center;
  transition: 0.1s ease;
  z-index: 2;
`;

const HeaderItems = styled.div`
  position: absolute;
  top: 4px;
  right: 0;
`;

const HeaderItem = styled.div`
  transition: 0.1s ease;
  border-radius: 3px;
  color: #000;
  display: block;
  float: left;
  font-weight: 700;
  line-height: 32px;
  margin-right: 4px;
  min-width: 32px;
  padding: 0;
`;

const Avatar = styled.div`
  bottom: 0;
  display: block;
  height: 30px;
  right: 8px;
  position: absolute;
  top: 5px;
  background-color: red;
  height: 30px;
  width: 30px;
  text-align: center;
  transition: 0.1s ease;
  z-index: 2;
`;

const AvatarWrapper = styled.div`
  cursor: pointer;
  align-items: center;
  a {
    text-decoration: none;
  }
  img {
    box-shadow: rgba(255, 255, 255, 0.2) 0 0 10px 2px;
  }
`;

class NavBar extends Component {
  // state = {  }
  render() {
    return (
      <Header>
        <HeaderLogo
          className="header-logo js-home-via-logo"
          href="/"
          aria-label="DigiTeam Home"
        >
          DigiTeam
        </HeaderLogo>
        <HeaderItems>
          <HeaderItem>
            <AvatarWrapper>
              <Link to="/user">{this.props.avatar}</Link>
            </AvatarWrapper>
          </HeaderItem>
          <HeaderItem>{this.props.user}</HeaderItem>
        </HeaderItems>
      </Header>
    );
  }
}

export default NavBar;
