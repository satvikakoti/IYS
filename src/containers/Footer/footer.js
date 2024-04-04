/* 
Creating the footer of the homepage.

Author: Lawrence Valerio
Date: 01/21/2021
Update Date: 02/01/2021
*/

import React from "react";
import styled from "styled-components";
import { UpArrow } from "./components/upArrow";
import { Logo } from "../homepage/components/logo";
import "./footer.css";
import { HashLink } from "react-router-hash-link";

const FooterContainer = styled.footer`
  background-color: #333333;
  display: flex;
  display: flex;
  width: 100%;
  height: 150px;
  box-shadow: 0px 0px 20px rgba(51, 50, 50);
  align-items: center;
`;

const LogoText = styled.h4`
  color: #f3890d;
  font-size: 20px;
  display: inline-block;
  text-align: center;

  @media screen and (max-width: 812px) {
    font-size: 14px;
  }
`;

const SecondSectionWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export function Footer(props) {
  return (
    <FooterContainer id="bottomSection">
      <SecondSectionWrap>
        <Logo
          MainTextMeaning="University of Manitoba"
          SubTextMeaning="CAreLab"
          className="logo-footer other-page"
          onClick={() => {
            window.location.href = "/";
          }}
        />
      </SecondSectionWrap>
      <SecondSectionWrap className="align-center">
        <LogoText>In Your Shoes</LogoText>
      </SecondSectionWrap>
      <SecondSectionWrap>
        <HashLink smooth to="#topSection">
          <UpArrow />
        </HashLink>
      </SecondSectionWrap>
    </FooterContainer>
  );
}
