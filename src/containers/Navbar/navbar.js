/**
 *
 * Creating the navbar component.
 *
 * Lawrence Valerio, Symon Kurt San Jose
 *
 *
 * Date: 01/21/2021
 * Update Date: 04/13/2021
 */

import React, { useState , setState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import styled from "styled-components";
import { Button } from "./components/button";
import { Logo } from "../homepage/components/logo";
import { Login } from "./components/login";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./components/modal.css";
import Register from "./components/Register";
import { CookiesProvider, useCookies } from "react-cookie";
import "./Navbar.css";
import { ForgotPassword } from "./components/ForgotPassword";
import { HashLink } from "react-router-hash-link";

//Styling the navbar
const NavbarContainer = styled.header`
  height: 90px;
  display: flex;
  height: 85px;
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;

  ${({ otherpages }) => {
    if (otherpages === "true") {
      return `
        background-color: white;
        box-shadow:0px 0px 15px rgba(51, 50, 50, 0.09);
        border-bottom: 5px solid #f3890d;
      `;
    } else {
      return `
        background-color: transparent;
        box-shadow:none
      `;
    }
  }};
  width: 100%;
  z-index: 1;

  @media screen and (max-width: 812px) {
    padding: 0px;

    ${({ otherpages }) => {
      if (otherpages === "true") {
        return `
          background-color: white;
        `;
      } else {
        return `
          background-color: rgba(50, 50, 50, 0.09);
        `;
      }
    }};
  }
`;

const LeftContainer = styled.div`
  height: 85px;
  width: 100%;
  padding: 0px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: inherit;

  @media screen and (max-width: 812px) {
    padding: 0px 50px;
    display: flex;
    justify-content: space-between;
    z-index: 10;
    width: 100%;
  }

  @media screen and (max-width: 456px) {
    padding: 0px 20px 0px 10px;
  }
`;

//Aligning the right container.
const RightContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  overflow: visible;
`;

//Styling the links of the navbar
const Links = styled(HashLink)`
  margin-right: 20px;
  cursor: pointer;
  font-size: 15px;
  text-decoration: none;
  z-index: 0;

  ${({ otherpages }) => {
    if (otherpages === "true") {
      return `
        color: #F3890D;
      `;
    } else {
      return `
        color: #FFF;
      `;
    }
  }}

  &:hover {
    text-decoration: none;

    ${({ otherpages }) => {
      if (otherpages === "true") {
        return `
          background-color: rgba(50, 50, 50, .50);
        `;
      } else {
        return `
          background-color: #F3890D;
        `;
      }
    }}
  }

  @media screen and (max-width: 812px) {
    margin: 5px;
    color: rgba(17, 24, 39, 1);
    padding: 10px 0px 10px 40px;
    font-size: 15px;
    display: flex;
    align-items: center;
    border-radius: 0.5rem;

    &:hover {
      text-decoration: none;
      background-color: rgba(240, 240, 240, 1);
    }
  }
`;

const SmallLinks = styled(Link)`
  display: none;
  padding: 5px 0px 5px 40px;
  border-radius: 0.5rem;

  & i {
    color: rgba(17, 24, 39, 1);
    font-size: inherit;
    margin: auto 0px;
  }

  & p {
    margin: 0 0 0 10px;
    font-size: inherit;
    color: rgba(75, 85, 99, 1) !important;
  }

  &:hover {
    text-decoration: none;

    color: ${({ otherpages }) => (otherpages === "true" ? "#F3890D" : "white")};
    background-color: rgba(249, 250, 251, 1);
  }

  @media screen and (max-width: 812px) {
    margin: 5px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    text-align: center;

    &:hover {
      text-decoration: none;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BottomText = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonStyling = styled(Button)`
  @media screen and (max-width: 812px) {
    width: 100%;
    height: auto;
    border-radius: 0px;
    background-color: #f3890d;
    color: white;
    padding: 20px 0px 20px 0px;
    font-size: 30px;

    &:hover {
      color: #f3890d;
    }
  }
`;

const LogoStyling = styled(Logo)`
  cursor: pointer;
`;

/**
 * Navbar component and links
 *
 * @param {*} props
 * @returns component for navigation bar
 */
export function Navbar(props) {
  //Modal and login, state hook.
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [active, setActive] = useState("");
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  function OpenModal() {
    setModalIsOpen(true);
  }

  const UserHubLinks = [
    {
      linkName: "User Profile",
      class: "small-link",
      iconName: "fas fa-user",
      aLink: "/UserHub/Profile",
    },
    {
      linkName: "Upload a Video",
      class: "small-link",
      iconName: "fas fa-video",
      aLink: "/UserHub/Upload",
    },
    {
      linkName: "My Videos",
      class: "small-link",
      iconName: "fas fa-tv",
      aLink: "/UserHub/MyVideos",
    },
    {
      linkName: "Statistics",
      class: "small-link",
      iconName: "fas fa-chart-area",
      aLink: "/UserHub/Statistics",
    },
    {
      linkName: "Messages",
      class: "small-link",
      iconName: "fas fa-envelope",
      aLink: "/UserHub/Messages",
    },
  ];

  function CloseModal() {
    setModalIsOpen(false);
  }

  const NavBarList = () => {
    return (
      <>
        {loggedIn ? (
          <>
            <nav className="userhub-navigation">
              {UserHubLinks.map((userHubLink, index) => {
                return (
                  <SmallLinks
                    to={userHubLink.aLink + "#topSection"}
                    key={index}
                    onClick={showSidebar}
                  >
                    <i
                      className={userHubLink.iconName + " " + userHubLink.class}
                    />
                    <p>{userHubLink.linkName}</p>
                  </SmallLinks>
                );
              })}
              {isAdmin ? (
                <SmallLinks
                  to={"/UserHub/Admin#topSection"}
                  onClick={showSidebar}
                >
                  <i className="fas fa-user-cog" />
                  <p>Administration</p>
                </SmallLinks>
              ) : (
                ""
              )}
              <hr
                style={{
                  border: "1px solid #eaeaea",
                  width: "100%",
                  margin: "0",
                }}
              />
            </nav>
          </>
        ) : (
          ""
        )}
        <Links smooth to="/Home#topSection" {...props}>
          Home
        </Links>
        <Links {...props} smooth to="/AboutUs#topSection">
          About Us
        </Links>
        <Links {...props} smooth to="/TrainingPortal#topSection">
          Training Portal
        </Links>
        <Links {...props} smooth to="/Pricing#topSection">
          Pricing
        </Links>
        {loggedIn ? (
          <Links
            {...props}
            smooth
            to="/UserHub#topSection"
            onClick={showSidebar}
          >
            User Hub
          </Links>
        ) : (
          ""
        )}

        {!loggedIn ? (
          <ButtonStyling
            {...props}
            small
            onClick={() => {
              OpenModal(true);
              setActive("signin");
            }}
          >
            Log In
          </ButtonStyling>
        ) : (
          <ButtonStyling small onClick={logoutUser}>
            Sign Out
          </ButtonStyling>
        )}
      </>
    );
  };

  const [token, setToken, deleteToken] = useCookies(["user-token"]);
  const [userId, setUserId, deleteUserId] = useCookies(["user-id"]);
  const [isAdmin, setIdAdmin, deleteIsAdmin] = useCookies(["is-admin"]);
  let loggedIn = false;

  // checks if user logged in to determine what to show on page
  if (userId["user-id"]) {
    loggedIn = true;
  } else {
    loggedIn = false;
  }

  // deletes token and redirects when user signs out
  const logoutUser = () => {
    deleteToken(["user-token"]);
    deleteUserId(["user-id"]);
    deleteIsAdmin(["is-admin"]);
    window.location.href = "/";
  };

  return (
    <NavbarContainer {...props}>
      <LeftContainer {...props}>
        <LogoStyling
          MainTextMeaning="In Your Shoes"
          SubTextMeaning="University of Manitoba"
          onClick={() => {
            window.location.href = "/";
          }}
          className="logo-header"
        />
        <div
          className={sidebar ? "close-icon" : "menu-icon"}
          onClick={showSidebar}
        >
          <i className={sidebar ? "fas fa-times fa-lg" : "fas fa-bars fa-lg"} />
        </div>
        <div className="nav-menu-web">
          <NavBarList />
        </div>
      </LeftContainer>
      <RightContainer {...props}>
        <div
          className={
            sidebar
              ? `nav-menu ${loggedIn ? "active-loggedIn" : "active"}`
              : "nav-menu"
          }
        >
          <NavBarList />
        </div>
        <Modal
          open={modalIsOpen}
          onClose={CloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          {/* Renders login.js */}
          {active === "signin" && (
            <ContentContainer>
              <Login />
              <BottomText>
                <a href="#/" onClick={() => setActive("forgot")}>
                  Forgot Password?
                </a>
                <a href="#/" onClick={() => setActive("signup")}>
                  Don't have an account?
                </a>
              </BottomText>
            </ContentContainer>
          )}
          {/* Renders Register.js */}
          {active === "signup" && (
            <ContentContainer>
              <CookiesProvider>
                <Register />
              </CookiesProvider>
              <BottomText>
                <a href="#/" onClick={() => setActive("signin")}>
                  Already have an account?
                </a>
              </BottomText>
            </ContentContainer>
          )}
          {/* Renders ForgotPassword.js */}
          {active === "forgot" && (
            <ContentContainer>
              <ForgotPassword />
              <BottomText>
                <a href="#/" onClick={() => setActive("signin")}>
                  Remember your account?
                </a>
                <a href="#/" onClick={() => setActive("signup")}>
                  Don't have an account?
                </a>
              </BottomText>
            </ContentContainer>
          )}
        </Modal>
      </RightContainer>
    </NavbarContainer>
  );
}
