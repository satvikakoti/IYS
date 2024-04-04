/**
 *
 * Creating the warning message component.
 *
 * Symon Kurt San Jose
 *
 *
 * Date: 04/23/2021
 * Update Date: 04/23/2021
 */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./CSS/WarningMessage.css";

const MessageContainer = styled.div`
  position: relative;
  top: 0;

  align-items: flex-end;
  justify-content: center;
  padding: 1.5rem 1rem 1.5rem 1rem;
  pointer-events: none;
  z-index: 2;

  @media screen and (max-width: 812px) {
    padding: 1rem 0.5rem 1rem 0.5rem;
  }
`;

const MessageCard = styled.div`
  width: 100%;
  min-width: 300px;
  z-index: 4;
  background-color: white;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
  border-radius: 0.5rem;
  border: 1px solid currentcolor;
  border-color: rgba(29, 78, 216, 1);
  pointer-events: auto;
  overflow: hidden;
`;

const MainMessageContainer = styled.div`
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  background-color: #c1d8fb;
  color: white;
  text-align: left;

  & div.button-class {
    margin-left: 1rem;
    display: flex;
    flex-shrink: 0 !important;

    & > button {
      background-color: inherit;
      color: rgba(29, 78, 216, 1);
      border-radius: 0.375rem;
      display: inline-flex;
      margin: 0px;
      border-width: 0 !important;

      & svg {
        color: inherit;
        width: 1.5rem;
        height: 1.5rem;
        display: block;
      }

      &:hover {
        background-color: rgba(29, 78, 216, 0.5);
        color: white;
      }
    }
  }
`;

const UploadHeading = styled.h4`
  text-decoration: none;
  font-weight: bold;
  margin: 10px 0px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(29, 78, 216, 1);
`;

const UploadMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(29, 78, 216, 1);
`;

//-------------[necessary variables]
// const [visible, setVisible] = useState(false);

// setVisible(true/false);

// {visible ? (
//   <WarningMessage
//     visible={visible}
//     setVisible={setVisible}
//   />
// ) : (
//   ""
// )}

export const WarningMessage = ({ visible, setVisible }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBanner(!showBanner);
    }, 200);
  }, []);

  return (
    <MessageContainer
      aria-live="assertive"
      className={showBanner ? "notif-show" : "notif-hide"}
    >
      <MessageCard>
        <MainMessageContainer>
          <div style={{ flex: "1 1 0%" }}>
            <UploadHeading>Uploading...</UploadHeading>
            <UploadMessage>
              If your internet upload speed is slow e.g., less than 3 megabits
              per second, you may receive a message like, "Something went
              wrong. Please try again".
              In such a case, kindly use an internet connection with better upload speed.
            </UploadMessage>
          </div>
          <div className="button-class">
            <button onClick={() => setVisible(!visible)}>
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </MainMessageContainer>
      </MessageCard>
    </MessageContainer>
  );
};
