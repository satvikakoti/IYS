/*
Creating the logo component.

Author: Lawrence Valerio
Date: 01/21/2021
Update Date:
*/

import React from "react";
import styled from "styled-components";
import ufmlogo from "./ufmlogo-reduced.png";
import "../../css/logo.css";

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & p,
  & h2 {
    color: white;
  }
`;

const LogoText = styled.h2`
  font-style: black;
  margin: 0;
  display: "inline-block";
`;

const SubText = styled.p`
  margin: 0;
`;

const UMLogo = styled.img`
  width: 40px;
  height: 70px;

  @media screen and (max-width: 812px) {
    width: 35px;
    height: 65px;

    position: relative;
    left: 5px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  left: 10px;

  @media screen and (max-width: 812px) {
    left: 15px;
  }
`;

export function Logo(props) {
  return (
    <LogoContainer {...props}>
      <UMLogo src={ufmlogo} alt="ufmlogo" />
      <TextContainer>
        <LogoText>{props.MainTextMeaning}</LogoText>
        <SubText>{props.SubTextMeaning}</SubText>
      </TextContainer>
    </LogoContainer>
  );
}
