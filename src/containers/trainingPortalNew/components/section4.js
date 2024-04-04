import React from "react"
import styled from "styled-components";
import { StepCard } from "./stepCard";

import image1 from "./../images/section4_1.png"

const ContentDiv = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const Line = styled.div`
  background-color: #BDBDBD;
  height: 1px;
  width: 90%;
  margin-top: 25px;
  margin-bottom: 25px;

  @media only screen and (max-width: 812px) {
    width: 100%;
  }
`;

export function Section4 () {
    return (
        <ContentDiv>
            <StepCard image={image1} text="In the User Profile page, you can edit your personal information"/>
            <Line />
            <p style={{ color: "black" }}>Please use at least 8 characters (minimum one number, special character[!@#$%^&*], and capital letter) for your password.</p>
        </ContentDiv>
    )
}