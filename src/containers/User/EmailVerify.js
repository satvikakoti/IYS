/**
 *
 * EmailVerify.js: Component to layout the email verification page
 *
 * Symon Kurt San Jose
 *
 * Date: 04/08/2021
 * Update Date: 04/13/2021
 */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar/navbar";
import { Footer } from "../Footer/footer";

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

/**
 * Component to layout the email verification page
 * @param {*} props
 * @returns Email Verification page
 */
export function EmailVerify(props) {
  const [loading, setLoading] = useState(true);
  const { emailToken } = useParams();
  const [verificationResponse, setVerificationResponse] = useState("");
  const [verifiedMessage, setVerifiedMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/IYS/email_verify/verify_email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_token: emailToken }),
    })
      .then((data) => data.json())
      .then((data) => {
        setVerificationResponse(data.message);
        setLoading(false);
        if (data.message === "Email verification successful") {
          setVerifiedMessage("Please log in for your next step.");
        } else {
          setVerifiedMessage(
            "Please make sure you clicked the link from your verification email."
          );
        }
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
        <Title>Email Verification</Title>
        {loading ? (
          <div className="SpinnerContainer" style={{ maxHeight: "50px" }}>
            <div className="spinner-border" />
          </div>
        ) : (
          <MessageDisplay>
            <p>{verificationResponse}</p>
            <p>{verifiedMessage}</p>
          </MessageDisplay>
        )}
      </TextContainer>
      <Footer />
    </PageContainer>
  );
}
