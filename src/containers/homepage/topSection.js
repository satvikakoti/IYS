/* 
Creating the top section of the homepage.

Author: Lawrence Valerio
Date: 01/21/2021
Update Date: 02/01/2021
*/

import React from "react";
import styled from "styled-components";
import { Button } from "../Navbar/components/button";

import img1 from "../../images/interactivepeople.jpg";
import { DownArrow } from "./components/downArrow";
import { Navbar } from "../Navbar/navbar";
import { HashLink } from "react-router-hash-link";

//using styled components to render tags with styles
const TopContainer = styled.header`
  width: 100%;
  height: 100vh;
  padding: 0;
  background-image: url(${img1});
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0px 0px 20px rgba(51, 50, 50);
`;

const DarkenBackground = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgb(55, 55, 55, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MiddleText = styled.h1`
  text-align: center;
  color: #fff;
  margin-top: 3em;
  font-style: black;
  font-size: 90px;
  margin-bottom: 5px;
  @media screen and (max-width: 812px) {
    margin-top: 50%;
    font-size: 45px;
  }
`;

const Subtext = styled.p`
  color: #fff;
  text-align: center;
  font-size: 20px;
  margin-bottom: 3em;
  @media screen and (max-width: 812px) {
    text-align: center;
    font-size: 13px;
    width: 80%;
  }
`;

const ScrollLink = styled(HashLink)`
  position: absolute;
  bottom: 5px;
`;

export function TopSection(props) {
  return (
    <TopContainer>
      <DarkenBackground>
        <Navbar />
        <MiddleText>In Your Shoes</MiddleText>
        <Subtext>
          For Anyone who wishes to better understand their <span style={{display: "inline-block"}}>Clients, Employees,
          Students, Colleagues, Family Members, or Friends, etc.</span>
        </Subtext>
        <Button
          onClick={() => {
            window.location.href = "/TrainingPortal";
          }}
        >
          Training Portal
        </Button>
        <ScrollLink smooth to="#bottomSection">
          <DownArrow />
        </ScrollLink>
      </DarkenBackground>
    </TopContainer>
  );
}
