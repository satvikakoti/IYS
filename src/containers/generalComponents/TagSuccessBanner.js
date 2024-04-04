/*
 * TagSuccessBanner.js: Component that is responsible for the banner in watch video pages.
 *
 * Symon Kurt San Jose
 *
 *
 * Date Created: 4/22/2021
 * Last Updated: 4/26/2021
 */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./CSS/TagSuccessBanner.css";

const Banner = styled.div`
  z-index: 1500;
  position: fixed;
  transition-duration: 100ms;
  right: 0px;
  left: 0px;
  padding-bottom: 0.5rem !important;

  @media only screen and (max-width: 456px) {
    padding-bottom: 0.2rem !important;
  }
`;

const BannerCard = styled.div`
  margin-left: auto !important;
  margin-right: auto !important;
  padding: 0px 20px;
  color: white;
  width: 90%;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;

  & > button {
    padding: 0.5rem;
    margin-right: -0.25rem;
    display: flex;
    border-radius: 0.375rem;
    color: inherit;
    background-color: inherit;
    border: 0;

    & svg {
      color: inherit;
      width: 1.5rem;
      height: 1.5rem;
      display: block;
      background-color: inherit;
    }

    &:hover {
      background-color: ${({ initPass }) => (initPass ? "#7b1919" : "#385f2b")};
    }
  }

  @media only screen and (max-width: 456px) {
    padding: 0px 10px;
  }
`;

const AlertIcon = styled.div`
  display: flex;
  flex: 1 1 0%;
  width: 0;
  align-items: center;
`;

//-------------[necessary variables]
// const [visible, setVisible] = useState(true);
// const [initPass, setInitPass] = useState(true);
// const [failMessage, setFailMessage] = useState("");

// const SetTagBanner = (tagSuccess, failInputMessage) => {
//   setFailMessage(failInputMessage);
//   setVisible(false);

//   setTimeout(() => {
//     setInitPass(tagSuccess);
//     setVisible(true);
//   }, 100);
// };

// SetTagBanner(true/false, "failMessage");

// {visible ? (
//   <TagSuccessBanner
//     initPass={initPass}
//     visible={visible}
//     setVisible={setVisible}
//     failMessage={failMessage}
//   />
// ) : (
//   ""
// )}

export const TagSuccessBanner = ({
  initPass,
  visible,
  setVisible,
  failMessage,
}) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBanner(!showBanner);
    }, 200);
  }, []);

  return (
    <Banner className={!showBanner ? "banner-init-pos" : "banner-show-pos"}>
      <BannerCard
        className={initPass ? "tag-success" : "tag-fail"}
        {...initPass}
      >
        <AlertIcon className="alert-icon">
          <span className={initPass ? "tag-success-effect" : "tag-fail-effect"}>
            <i className="far fa-bell" />
          </span>
          <p>{initPass ? "Tag Successful" : failMessage}</p>
        </AlertIcon>
        <button type="button" onClick={() => setVisible(!visible)}>
          <span className="sr-only">Dismiss</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </BannerCard>
    </Banner>
  );
};
