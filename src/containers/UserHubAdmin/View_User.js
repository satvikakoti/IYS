/**
 *
 * View_User.js: Component to layout view individual user page of admin tab
 *
 * Lawrence Valerio
 *
 * Date: 03/23/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "./Admin.css";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the view individual user page of the admin tab
 * @param {*} props
 * @returns View Individual User page
 */
export function View_User(props) {
  const [token] = useCookies(["user-token"]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(true);
  const [userVideos, setUserVideos] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Returns to userhub page if user is not admin.
   */
  if (token["is-admin"] === "false") {
    window.location.href = "/UserHub/";
  }

  /**
   *Fetches user information and sets the data.
   */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setUsername(data.username);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setOrganization(data.organization);
        setIsActive(data.is_active);
        setIsAdmin(data.is_admin);
      })
      .catch((error) => console.error(error));

    fetch(`${process.env.REACT_APP_API_URL}/IYS/videos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setUserVideos(data);
      })
      .catch((error) => console.error(error));

    fetch(`${process.env.REACT_APP_API_URL}/IYS/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token["user-token"]}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setUserMessages(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  /**
   * Updates the users information.
   */
  const submitHandler = (e) => {
    e.preventDefault();
    if (password.length === 0 && passwordCheck === true) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${props.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({
          username: username,
          first_name: firstName,
          last_name: lastName,
          organization: organization,
          is_active: isActive,
          is_admin: isAdmin,
        }),
      })
        .then(() => window.location.reload())
        .catch((error) => console.error(error));
    }

    if (password.length > 0 && passwordCheck === true) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${props.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token["user-token"]}`,
        },
        body: JSON.stringify({
          username: username,
          first_name: firstName,
          last_name: lastName,
          organization: organization,
          password: password,
          is_active: isActive,
          is_admin: isAdmin,
        }),
      })
        .then(() => window.location.reload())
        .catch((error) => console.error(error));
    }
  };

  //Verifies password
  const VerifyPassword = (e) => {
    setPassword(e.target.value);
    PasswordCheck(e.target.value);
  };

  const VerifyConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    ConfirmPasswordCheck(e.target.value);
  };

  const PasswordCheck = (value) => {
    if (value === confirmPassword) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }
  };

  const ConfirmPasswordCheck = (value) => {
    if (value === password) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }
  };

  //Checks if checkbox has been checked.
  const CheckBoxChangeActive = () => {
    setIsActive(!isActive);
  };

  const CheckBoxChangeAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>Administration</UserHubPageTitle>
      <div className="AdminHubContainer">
        <BackToHome />
        <div className="AdminHubForm">
          {loading ? (
            <>
              <div className="SpinnerContainer">
                <div className="spinner-border" />
              </div>
            </>
          ) : (
            <>
              <div className="UserInfoContainer">
                <div className="UserInfo InformationContainers">
                  <h1 className="UserInfoTitle">Information</h1>
                  <form id="UserInformationForm" onSubmit={submitHandler}>
                    <div className="UserInformationContainer">
                      <div className="InputContainer">
                        <label className="UserLabel" htmlFor="username">
                          Email:
                        </label>
                        <input
                          name="username"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="InputContainer">
                        <label className="UserLabel" htmlFor="first_name">
                          First Name:
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="InputContainer">
                        <label className="UserLabel" htmlFor="last_name">
                          Last Name:
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        <br />
                      </div>
                      <div className="InputContainer">
                        <label className="UserLabel" htmlFor="organization">
                          Organization:
                        </label>
                        <input
                          type="text"
                          name="organization"
                          id="organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                        />
                      </div>
                      <div className="InputContainer">
                        <label className="UserLabel" htmlFor="password">
                          New Password:
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          onChange={VerifyPassword}
                        />
                      </div>
                      <div className="InputContainer">
                        <label className="UserLabel" htmlFor="confirm_password">
                          Confirm New Password:
                        </label>
                        <input
                          type="password"
                          name="confirm_password"
                          id="confirm_password"
                          onChange={VerifyConfirmPassword}
                        />
                      </div>
                      <div className="InputContainer">
                        {!passwordCheck ? (
                          <p className="Errors">Passwords do not match</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="CheckBoxContainer">
                      <label className="ActiveLabel" htmlFor="ActiveCheck">
                        Active User:
                      </label>
                      <br />
                      <input
                        type="checkbox"
                        name="ActiveCheck"
                        id="ActiveCheck"
                        checked={isActive}
                        onChange={CheckBoxChangeActive}
                      />
                    </div>
                    <div className="CheckBoxContainer">
                      <label className="ActiveLabel" htmlFor="ActiveCheck">
                        Admin User:
                      </label>
                      <br />
                      <input
                        type="checkbox"
                        name="ActiveCheck"
                        id="ActiveCheck"
                        checked={isAdmin}
                        onChange={CheckBoxChangeAdmin}
                      />
                    </div>
                    <div className="UserUpdateButton">
                      <button className="UpdateButton" type="submit">
                        Update Information
                      </button>
                    </div>
                  </form>
                </div>
                <table className="ViewUserTable">
                  <thead>
                    <tr>
                      <th>Videos</th>
                    </tr>
                  </thead>
                  {userVideos.map((videos) => {
                    return (
                      <>
                        {videos.userId == props.id ? (
                          <tbody key={videos.id}>
                            <tr>
                              <td>
                                <Link
                                  to={"/UserHub/Admin/View_Video/" + videos.id}
                                >
                                  {videos.title}
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
                </table>

                <table className="ViewUserTable">
                  <thead>
                    <tr>
                      <th>Messages</th>
                    </tr>
                  </thead>
                  {userMessages.map((messages) => {
                    return (
                      <>
                        {messages.user == props.id ? (
                          <tbody key={messages.id}>
                            <tr>
                              <td>
                                <Link
                                  to={"/UserHub/View_Message/" + messages.id}
                                >
                                  {messages.title}
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </UserContainer>
  );
}
