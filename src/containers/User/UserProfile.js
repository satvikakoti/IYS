/**
 *
 * UserProfile.js: Component to layout the user profile page
 *
 * Symon Kurt San Jose, Lawrence Valerio
 *
 * Date: 02/09/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { UserHubPageTitle } from "../generalComponents/UserHubPageTitle";
import { BackToHome } from "../generalComponents/BackToHome";
import "./css/UserProfile.css";

const UserContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * Component to layout the user profile page
 * @returns User Profile page
 */
export function UserProfile() {
  const [token] = useCookies(["user-token"]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(true);

  //  Gets the user's personal information using the user-token
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${token["user-id"]}`, {
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
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  //  Edits the user's personal information on submit
  const submitHandler = (e) => {
    e.preventDefault();
    if (password.length === 0 && passwordCheck === true) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${token["user-id"]}/`, {
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
        }),
      })
        .then(() => window.location.reload())
        .catch((error) => console.error(error));
    }

    if (password.length > 0 && passwordCheck === true) {
      fetch(`${process.env.REACT_APP_API_URL}/IYS/users/${token["user-id"]}/`, {
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
        }),
      })
        .then(() => window.location.reload())
        .catch((error) => console.error(error));
    }
  };

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

  return (
    <UserContainer style={{ flex: 4 }}>
      <UserHubPageTitle>User Profile</UserHubPageTitle>
      <div className="UserFormContainer">
        <BackToHome />
        <form className="UserInformationForm" onSubmit={submitHandler}>
          {loading ? (
            <div className="SpinnerContainer" style={{ maxHeight: "500px" }}>
              <div className="spinner-border" />
            </div>
          ) : (
            <div>
              <label htmlFor="username">Email:</label>
              <input
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <label htmlFor="first_name">First Name:</label>
              <input
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <br />
              <label htmlFor="last_name">Last Name:</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <br />
              <label htmlFor="organization">Organization:</label>
              <input
                type="text"
                name="organization"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
              <br />
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={VerifyPassword}
              />
              <br />
              <label htmlFor="confirm_password">Confirm Password:</label>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                onChange={VerifyConfirmPassword}
              />
              {!passwordCheck ? (
                <>
                  <p className="Errors">Passwords do not match</p>
                </>
              ) : (
                ""
              )}
              <br />
              <div className="UpdateButtonContainer">
                <button className="UpdateButton secondary-button" type="submit">
                  Update Information
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </UserContainer>
  );
}
