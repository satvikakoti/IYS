/* 
Creating the top section of the training portal.

Author: Lawrence Valerio
Date: 01/22/2021
Update Date: 
*/

import React, { useState } from "react";
import styled from "styled-components";
import { PlusIcon } from "./plusIcon";
import { MinusIcon } from "./minusIcon";
import {
  Content1,
  Content2,
  Content3,
  Content4,
  Content5,
  Content6,
} from "./content";

const AccordionContainer = styled.div`
  color: #2f2f2f;
  width: 90%;
  &:not(:last-of-type) {
    border-bottom: 2px solid #bab1b1;
  }
`;

const PlusIconContainer = styled.div`
  display: inline-block;
  padding-right: 10px;
`;

const TitleContainer = styled.div`
  align-items: center;
`;

const Title = styled.h2`
  display: inline-block;
  color: #2f2f2f;
  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 812px) {
    font-size: 18px;
  }
`;

export function Accordion1(props) {
  const [active, setActive] = useState(false);

  return (
    <AccordionContainer>
      <TitleContainer>
        <PlusIconContainer onClick={() => setActive(!active)}>
          {active ? <MinusIcon /> : <PlusIcon />}
        </PlusIconContainer>
        <Title onClick={() => setActive(!active)}>Before you begin</Title>
      </TitleContainer>
      {active && <Content1 />}
    </AccordionContainer>
  );
}

export function Accordion2(props) {
  const [active, setActive] = useState(false);

  return (
    <AccordionContainer>
      <TitleContainer>
        <PlusIconContainer onClick={() => setActive(!active)}>
          {active ? <MinusIcon /> : <PlusIcon />}
        </PlusIconContainer>
        <Title onClick={() => setActive(!active)}>Creating an account</Title>
      </TitleContainer>
      {active && <Content2 />}
    </AccordionContainer>
  );
}

export function Accordion3(props) {
  const [active, setActive] = useState(false);

  return (
    <AccordionContainer>
      <TitleContainer>
        <PlusIconContainer onClick={() => setActive(!active)}>
          {active ? <MinusIcon /> : <PlusIcon />}
        </PlusIconContainer>
        <Title onClick={() => setActive(!active)}>
          Navigating the User Hub
        </Title>
      </TitleContainer>
      {active && <Content3 />}
    </AccordionContainer>
  );
}

export function Accordion4(props) {
  const [active, setActive] = useState(false);

  return (
    <AccordionContainer>
      <TitleContainer>
        <PlusIconContainer onClick={() => setActive(!active)}>
          {active ? <MinusIcon /> : <PlusIcon />}
        </PlusIconContainer>
        <Title onClick={() => setActive(!active)}>User Profile details</Title>
      </TitleContainer>
      {active && <Content4 />}
    </AccordionContainer>
  );
}

export function Accordion5(props) {
  const [active, setActive] = useState(false);

  return (
    <AccordionContainer>
      <TitleContainer id="uploadVideo">
        <PlusIconContainer onClick={() => setActive(!active)}>
          {active ? <MinusIcon /> : <PlusIcon />}
        </PlusIconContainer>
        <Title onClick={() => setActive(!active)}>Uploading Videos</Title>
      </TitleContainer>
      {active && <Content5 />}
    </AccordionContainer>
  );
}

export function Accordion6(props) {
  const [active, setActive] = useState(false);

  return (
    <AccordionContainer>
      <TitleContainer>
        <PlusIconContainer onClick={() => setActive(!active)}>
          {active ? <MinusIcon /> : <PlusIcon />}
        </PlusIconContainer>
        <Title onClick={() => setActive(!active)}>
          Converting videos to .mp4
        </Title>
      </TitleContainer>
      {active && <Content6 />}
    </AccordionContainer>
  );
}
