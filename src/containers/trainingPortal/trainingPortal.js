/* 
Creating the Training Portal.

Author: Lawrence Valerio
Date: 01/22/2021
Update Date: 
*/

import React from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar/navbar";
import { BottomSection } from "./bottomSection";
import { Footer } from "../Footer/footer";

const TrainingPortalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 6em;
  margin-bottom: 5em;
  text-align: center;
`;

const Text = styled.h1`
  font-family: "Roboto", serif;
  font-weight: bold;
  color: #f3890d;
  font-size: 75px;

  @media screen and (max-width: 812px) {
    font-size: 40px;
  }

  @media screen and (max-width: 456px) {
    font-size: 30px;
  }
`;

export function TrainingPortal(props) {
  return (
    <TrainingPortalContainer>
      <Navbar otherpages="true" className="other-page" />
      <TextContainer>
        <Text>Training Portal</Text>
      </TextContainer>
      <BottomSection />
      <Footer />
    </TrainingPortalContainer>
  );
}
