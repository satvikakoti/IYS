/**
 *
 * PasswordReset.js: Component to layout the password reset page
 *
 * Symon Kurt San Jose
 *
 * Date: 03/19/2021
 * Update Date: 04/13/2021
 */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar/navbar";
import { Footer } from "../Footer/footer";
import "./css/StatisticsPage.css";
import { Button } from "../Navbar/components/button";

import { useParams } from "react-router-dom";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
  padding: 40px 0px 20px 0px;
  margin-top: 6em;
  min-height: 400px;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 70px;
  text-align: center;
  font-family: "Roboto", serif;
  font-weight: bold;
  margin-bottom: 50px;

  color: #f3890d;

  @media screen and (max-width: 812px) {
    font-size: 40px;
  }

  @media screen and (max-width: 456px) {
    font-size: 30px;
  }
`;

const MessageDisplay = styled.div`
  margin: 0px auto;
  display: inline-block;
  width: 90%;
  color: black;
`;

//Styling all other inputs
const Input = styled.input`
  height: 40px;
  margin-bottom: 20px;
  width: 40%;
  display: block;
`;

const passwordRegex = RegExp(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);

const ResetPasswordForm = styled.form`
  max-width: 90%;

  @media screen and (max-width: 812px) {
    max-width: 90%;
  }
`;

const ResetButton = styled(Button)`
  width: 200px;
  margin-top: 10px;
  margin: 0px;
`;

/**
 * Component to layout the password reset page
 * @param {*} props
 * @returns Password Reset page
 */
export function ResetPassword(props) {
  const [loading, setLoading] = useState(true);
  const { verificationToken } = useParams();
  const [password, setPassword] = useState("");
  const [validCredentials, setValidCredentials] = useState(true);
  const [passwordMessage, setPasswordMessage] = useState("");

  const resetPasswordClicked = (e) => {
    e.preventDefault();

    if (passwordRegex.test(password)) {
      setPasswordMessage("");
      fetch(`${process.env.REACT_APP_API_URL}/IYS/password_reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken, password }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.status === "OK") {
            window.location.href = "/";
          } else {
            setPasswordMessage(data.password);
          }
        })
        .catch((error) => console.error(error));
    } else {
      setPasswordMessage(
        "Please use at least 8 characters (minimum one number, special character, and capital letter)"
      );
    }
  };

  useEffect(() => {
    //Getting the list of messages
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/password_reset/validate_token/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.status !== "OK") {
          setValidCredentials(false);
        } else {
          setValidCredentials(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <PageContainer>
      <Navbar otherpages="true" />
      <TextContainer>
        <Title>Reset Password</Title>
        {loading ? (
          <div className="SpinnerContainer" style={{ maxHeight: "50px" }}>
            <div className="spinner-border" />
          </div>
        ) : (
          <MessageDisplay>
            {!validCredentials ? (
              <div style={{ marginBottom: "40px" }}>
                Credentials could not be found
              </div>
            ) : (
              <div>
                <div style={{  }}>Enter new password</div>
                <div style={{ marginBottom: "40px" }}>Please use at least 8 characters (minimum one number, capital letter and special character [!@#$%^&*])</div>
                <ResetPasswordForm>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    noValidate
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordMessage.length > 0 && (
                    <div style={{ color: "red" }}>{passwordMessage}</div>
                  )}
                  <ResetButton OtherPages onClick={resetPasswordClicked}>
                    Reset Password
                  </ResetButton>
                </ResetPasswordForm>
              </div>
            )}
          </MessageDisplay>
        )}
      </TextContainer>
      <Footer />
    </PageContainer>
  );
}
