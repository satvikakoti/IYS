/**
 * ForgotPassword.js: Function component for reset passwords
 *
 * Lawrence Valerio, Symon Kurt San Jose
 *
 *
 * Date Created: 02/03/2021
 * Last Updated: 04/12/2021
 */

import React, { useState } from "react";
import "../Navbar.css";
import { Button } from "./button";
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  height: 30px;
`;

const ForgotPassButton = styled(Button)`
  width: 80%;
  margin: 20px 0px 0px 0px;
`;

const ErrorMessage = styled.div`
  color: red;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  min-width: 300px;
`;

export function ForgotPassword() {
  const [validCredentials, setValidCredentials] = useState(true);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const requestData = { email: username };
  const [emailSent, setEmailSent] = useState(true);

  /**
   * Applies for a password reset token to the API
   *
   * Symon Kurt San Jose
   */
  const forgotPasswordClicked = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(`${process.env.REACT_APP_API_URL}/IYS/password_reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status === "OK") {
          setValidCredentials(true);
          setEmailSent(false);
        } else {
          setValidCredentials(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // Returns forgot password component to be used on modal window
  return (
    <ContentContainer>
      <h1 className="Title" style={{ marginBottom: "30px" }}>
        Forgot your password?
      </h1>
      <div style={{ marginBottom: "50px" }}>
        {emailSent ? (
          loading ? (
            <div className="SpinnerContainer" style={{ maxHeight: "50px" }}>
              <div className="spinner-border" />
            </div>
          ) : (
            <div>
              <p>
                Don't worry! Just enter your email and we'll send a link to
                reset your password.
              </p>
              <form>
                <Input
                  type="text"
                  className="EmailInput"
                  name="EmailInput"
                  placeholder="Email Address"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {!validCredentials ? (
                  <ErrorMessage>Invalid email</ErrorMessage>
                ) : (
                  ""
                )}
                <ForgotPassButton OtherPages onClick={forgotPasswordClicked}>
                  Reset password
                </ForgotPassButton>
              </form>
            </div>
          )
        ) : (
          <div>
            <p> Email has been sent </p>
            <p>
              Please do check your spam folder if the reset email doesn't arrive
              in your inbox.
            </p>
          </div>
        )}
      </div>
    </ContentContainer>
  );
}
