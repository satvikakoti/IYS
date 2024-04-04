/* 
Creating the bottom section of the training portal.

Author: Lawrence Valerio
Date: 01/22/2021
Update Date: 
*/

import React from "react";
import styled from "styled-components";
import {
  Accordion1,
  Accordion2,
  Accordion3,
  Accordion4,
  Accordion5,
  Accordion6,
} from "./components/accordion";

const BottomSectionContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #2f2f2f;
  font-size: 40px;
  width: 85%;
`;

const ContentContainer = styled.div`
  border-top: 2px solid #bab1b1;
  width: 85%;
  margin-bottom: 8em;
  padding-bottom: 10px;
`;

const AccordionContainer = styled.div`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentDescription = styled.div`
  font-weight: ${({ title }) => (title ? "bold" : "normal")};
  padding-left: ${({ SubText }) => (SubText ? "30px" : "0px")};
  margin-bottom: 10px;
`;

export function BottomSection(props) {
  return (
    <BottomSectionContainer>
      <Title>Expand any of the topics below to start</Title>
      <ContentContainer>
        <AccordionContainer>
          <Accordion1 />
          <Accordion2 />
          <Accordion3 />
          <Accordion4 />
          <Accordion5 />
          <Accordion6 />
        </AccordionContainer>
      </ContentContainer>
    </BottomSectionContainer>
  );
}
