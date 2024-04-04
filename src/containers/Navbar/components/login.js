/**
 * login.js: Function component that is used perform user login functionality
 *
 * Michelle Peters, Lawrence Valerio, Symon Kurt San Jose
 *
 *
 * Date Created: 10/27/2020
 * Last Updated: 07/26/2021
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { Button } from "./button";
import axios from "axios";

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
`;

const LoginText = styled.h2``;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  margin: 0px;
`;

const ErrorMessage = styled.div`
  color: red;
`;

/**
 *
 * @returns Login inputs
 */
export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validCredentials, setValidCredentials] = useState("");
  const [token, setToken] = useCookies(["user-token"]);
  const [userId, setUserId] = useCookies(["user-id"]);
  const [isAdmin, setIsAdmin] = useCookies(["is-admin"]);
  const [loading, setLoading] = useState(false);
  // log in credentials to be sent to server
  const requestData = { username, password };

  /**
   * Return user to refreshed home page if logged in
   *
   * Michelle Peters
   */
  useEffect(() => {
    /**
     * Gets user id associated with the token.
     *
     * Symon Kurt San Jose
     */
    const GetToken = async () => {
      try {
        const TokenResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/IYS/tokens/${token["user-token"]}/`
        );
        return TokenResponse.data;
      } catch (err) {
        return err;
      }
    };

    /**
     * Checks whether user is an administrator to
     * show the administration tab on the userhub page
     *
     * Lawrence Valerio
     */
    const AdminCheck = (userId) => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/IYS/users/${userId}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token["user-token"]}`,
          },
        })
        .then((response) => response.data)
        .then((data) => {
          setIsAdmin("is-admin", data.is_admin);
          setUserId("user-id", userId);
          window.location.href = "/UserHub";
        });
    };

    //  If user token exists then get the user id and check if they are admin user
    if (token["user-token"] && token["user-token"] !== "undefined") {
      GetToken()
        .then((data) => {
          AdminCheck(data.user);
        })
        .catch((error) => console.error(error));
    }
  }, [token]);

  /**
   * Gets the authentication token from the api endpoint using
   * the username and password.
   *
   * Symon Kurt San Jose
   */
  const GetAuth = async () => {
    try {
      const authResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/`,
        {
          headers: { "Content-Type": "application/json" },
          username: requestData.username,
          password: requestData.password,
        }
      );

      return authResponse;
    } catch (err) {
      return err.request;
    }
  };

  /**
   * Attempt to get valid token using log in credentials
   * and store that token using cookies
   *
   * Michelle Peters
   */
  const loginClicked = (e) => {
    e.preventDefault();
    setLoading(true);
    GetAuth().then((data) => {
      if (data.status === 200) {
        setToken("user-token", data.data.token);
      } else if (data.status === 403) {
        setValidCredentials("User not registered. Please verify your email.");
        setLoading(false);
      } else {
        setValidCredentials("Email and/or password invalid");
        setLoading(false);
      }
    });
  };

  /**
   * Return login inputs
   */
  return (
    <ContentContainer>
      {loading === true ? (
        <>
          <div className="SpinnerLoadingContainer">
            <div className="spinner-border" />
            <p>Logging in please wait...</p>
          </div>
        </>
      ) : (
        <form>
          <LoginText>Log In</LoginText>
          <Input
            name="username"
            placeholder="Email (johndoe@email.com)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorMessage>{validCredentials}</ErrorMessage>
          <LoginButton OtherPages onClick={loginClicked}>
            Log In
          </LoginButton>
        </form>
      )}
    </ContentContainer>
  );
}
