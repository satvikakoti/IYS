/* 
Redsigning the bottom section of the Training Portal.

Author: Parthiv Menon
Date: 11/03/2021 
*/

import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { Section1 } from "./components/section1";
import { Section2 } from "./components/section2";
import { Section3 } from "./components/section3";
import { Section4 } from "./components/section4";
import { Section5 } from "./components/section5";
import { Section6 } from "./components/section6";

const BottomSectionContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  margin-bottom: 8em;
  padding: 2rem;
  display: grid;
  grid-template-columns: 25% 75%;

  @media only screen and (max-width: 812px) {
    width: 100%;
    padding: 0rem;
    grid-template-columns: 100%;
  }
`;

const IndexBox = styled.div`
  width: 100%;

  @media only screen and (max-width: 812px) {
    position: fixed;
    top: 10%;
    background-color: white;
    z-index: 10;
    overflow: hidden;
  }
`;

const ListElement = styled.a`
  color: #939F96;
  text-decoration: none;

  &:hover {
      color: grey;
      cursor: pointer;
      text-decoration: none;
  }
`;

const SideNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const DocSide = styled.div`
  width: 100%;
`;

const SideNavHeader = styled.div`
  display: none;  

  @media only screen and (max-width: 812px) {
    display: flex;
    height: 50px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    background-color: #F3890D;
  }
`;


export function BottomSection() {

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if(!location.hash || location.hash === null || location.hash === undefined || !location.hash.includes("#section")) {
      history.push("#section1")
    } else {
      history.push(location.hash)
    }
    if(window.innerWidth > "812") {
      document.getElementById("index-box").style.position = "fixed";
    } 
  }, [])

  // sets the active section based on user click
  const handleActive = (id) => {
    for(let i = 0; i < 6; i++) {
        document.getElementById(`section-${i + 1}`).style.color = "#939F96";
    }
    document.getElementById(id).style.color = "#F3890D";
  }

  const handleIndexClick = () => {
    let indexBox = document.getElementById("index-box")
    if(indexBox.style.display === "none") {
      indexBox.style.display = "block";
    } else {
      indexBox.style.display = "none";
    }
  }

  return (
    <BottomSectionContainer>
      <ContentContainer>
          <IndexBox>
            <SideNav>
              <SideNavHeader>
                <p style={{ color: "white" }}>Training Portal Tutorial</p>
                <i className="fa fa-bars fa-lg text-white" onClick={handleIndexClick}></i>
              </SideNavHeader>
              <ul style={{ listStyle: "none", padding: "20px" }} id="index-box">
                <li onClick={() => handleActive("section-1")}><ListElement onClick={() => handleActive("section-1")} id="section-1" style={{ color: "#F3890D" }} href="#section1">Before you begin</ListElement></li>
                <li onClick={() => handleActive("section-2")}><ListElement onClick={() => handleActive("section-2")} id="section-2" href="#section2">Creating an account</ListElement></li>
                <li onClick={() => handleActive("section-3")}><ListElement onClick={() => handleActive("section-3")} id="section-3" href="#section3">Navigating the User Hub</ListElement></li>
                <li onClick={() => handleActive("section-4")}><ListElement onClick={() => handleActive("section-4")} id="section-4" href="#section4">User Profile Details</ListElement></li>
                <li onClick={() => handleActive("section-5")}><ListElement onClick={() => handleActive("section-5")} id="section-5" href="#section5">Uploading Videos</ListElement></li>
                <li onClick={() => handleActive("section-6")}><ListElement onClick={() => handleActive("section-6")} id="section-6" href="#section6">Converting videos to MP4</ListElement></li>
              </ul>
            </SideNav>
          </IndexBox>
          <DocSide>
            {
                location.hash === "#section1" 
                ? <Section1 /> 
                : (
                    location.hash === "#section2"
                    ? <Section2 />
                    : (
                        location.hash === "#section3"
                        ? <Section3 />
                        : (
                            location.hash === "#section4"
                            ? <Section4 />
                            : (
                                location.hash === "#section5"
                                ? <Section5 /> 
                                : (
                                    location.hash === "#section6"
                                    ? <Section6 /> 
                                    : ""   
                                )
                            )
                        )
                    )
                )
            }
          </DocSide>
      </ContentContainer>
    </BottomSectionContainer>
  );
}
