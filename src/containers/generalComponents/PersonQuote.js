/*
 * PersonQuote.js: Component that is responsible for the quote section in homepage
 *
 * Symon Kurt San Jose
 *
 *
 * Date Created: 4/11/2021
 * Last Updated: 4/12/2021
 */

import React from "react";
import styled from "styled-components";
import img1 from "./images/talking_with_cups.jpg";

const QuoteText = styled.h1`
  font-weight: bold;
  font-size: 25px;
  line-height: 38px;
  margin: 0px;
  padding: 1.5rem !important;
  color: rgba(55, 65, 81, 1);

  @media screen and (max-width: 812px) {
    font-size: 20px;
    line-height: 30px;
    padding: 0.5rem !important;
  }

  @media screen and (max-width: 456px) {
    font-size: 10px;
    line-height: 15px;
  }
`;

const QuoteAuthor = styled.h3`
  font-weight: normal;
  font-size: 20px;
  margin: 0;
  padding: 1.5rem !important;
  background-color: rgba(55, 65, 81, 1);
  color: rgba(255, 255, 255, 1);

  @media screen and (max-width: 812px) {
    font-size: 15px;
    padding: 0.5rem !important;
  }

  @media screen and (max-width: 456px) {
    font-size: 9px;
  }
`;

const QuoteBlock = styled.div`
  background-image: url(${img1});
  padding: 30px 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  @media screen and (max-width: 812px) {
    background-size: cover;
  }
`;

const Quotation = styled.blockquote`
  background-color: rgba(255, 255, 255, 1);
  overflow: hidden;
  border-radius: 0.75rem;
  width: 50%;
  float: right;
  height: auto;
  margin: 0;

  @media screen and (max-width: 812px) {
    width: 60%;
  }
`;

/**
 * Component to layout the qoutation banner of the userhub
 * @returns The quote banner
 */
export const PersonQuote = () => {
  return (
    <QuoteBlock>
      <Quotation>
        <QuoteText>
          "Cognitive empathy is the imaginative ability to step inside someone
          else's shoes to understand their thoughts and feelings, communicate
          that understanding to check for accuracy, and act on that
          understanding in a helpful way."
        </QuoteText>
        <QuoteAuthor>
          Dr. Michelle Lobchuk, RN, Phd, Associate Professor and Co-Inventor
        </QuoteAuthor>
      </Quotation>
    </QuoteBlock>
  );
};
