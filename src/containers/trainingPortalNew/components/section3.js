import React from "react"
import styled from "styled-components";
import { StepCard } from "./stepCard";

import image1 from "./../images/section3_1.png"
import image2 from "./../images/section3_2.png"

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

const ModuleBox = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Module = styled.p`
  color: white;
  background-color: black;
  padding: 10px 20px;
  margin: 0px 10px;
`;

export function Section3 () {
    return (
        <ContentDiv>
            <StepCard image={image1} text="After sign in, to view what the application is capable of and its features, click on the 'User Hub' tab that will appear near at the top of the screen"/>
            <Line />
            <StepCard image={image2} text="After clicking the tab, You will find yourself in the User Hub page where you can access the website's main features"/>
            <p style={{ color: "black" }}>In this page, you will find yourself looking at 4 different modules that you will be using for most of your time here. </p>
            <ModuleBox>
                <Module>User Profile</Module>
                <Module>Upload a video</Module>
                <Module>Your videos</Module>
                <Module>Statistics</Module>
            </ModuleBox>
        </ContentDiv>
    )
}