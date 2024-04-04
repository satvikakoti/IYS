/* 
Creating the about page of the website

Author: Symon Kurt San Jose
Date: 01/27/2021
Update Date: 
*/

import React from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar/navbar";
import { Footer } from "../Footer/footer";
import ScrollAnimation from "react-animate-on-scroll";
import "./CSS/AboutPage.css";
import "animate.css";
import { FileDownload } from "../generalComponents/fileDownload";
import { scroller } from "react-scroll";
import { InventorSection } from "./InventorSection";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.main`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px 0px 20px 0px;

  ${({ Team }) => {
    if (Team) {
      return `
        margin: 0;
        padding-top: 50px;
        background-color: #75ACCF;
      `;
    } else {
      return `
      margin: 70px 0px;
      padding-top: 0px;
      background-color: #FFF;
      `;
    }
  }}
`;

const Title = styled.h1`
  font-size: 70px;
  text-align: center;
  font-family: "Roboto", serif;
  font-weight: bold;
  margin-bottom: 100px;

  color: ${({ Team }) => (Team ? "#FFF" : "#f3890d")};

  @media screen and (max-width: 812px) {
    font-size: 40px;
    width: 80%;
  }

  @media screen and (max-width: 456px) {
    font-size: 30px;
  }
`;

const Description = styled.p`
  width: 80%;
  font-size: 20px;
  font-family: "Roboto", sans-serif;

  @media screen and (max-width: 812px) {
    font-size: 15px;
  }
`;

const DescrptionList = styled.div`
  width: 70%;
  font-size: 20px;
  font-family: "Roboto", sans-serif;

  @media screen and (max-width: 812px) {
    font-size: 15px;
  }
`;

const Anchur = styled.a`
  width: 70%;
  font-size: 20px;
  font-family: "Roboto", sans-serif;
  display: inline;

  @media screen and (max-width: 812px) {
    font-size: 15px;
  }
`;

const Introduction = styled.p`
  width: 70%;
  overflow: hidden;
  color: #fff;
  font-family: "Roboto", sans-serif;

  ${({ FullNames }) => {
    if (FullNames) {
      return `
        font-size: 35px;
        font-weight: bold;
        padding-top: 0px;
      `;
    } else {
      return `
        font-size: 20px;
        font-weight: normal;
        padding-top: 20px;
      `;
    }
  }}

  text-align: ${({ RightAlign }) => (RightAlign ? "right" : "left")};
  float: ${({ RightAlign }) => (RightAlign ? "right" : "left")};
  margin: 0px 30px 0px 30px;

  @media screen and (max-width: 812px) {
    align-items: center;

    font-size: ${({ FullNames }) => (FullNames ? "15 px" : "13px")};

    padding-top: 20px;
    text-align: left;
    float: none;
    margin: 0;
  }
`;

const ImageBlock = styled.img`
  width: 200px;
  display: inline-block;
  height: 200px;
  @media screen and (max-width: 812px) {
    float: none;
    order: 1;
  }
`;

const IntroContainer = styled.div`
  float: ${({ RightAlign }) => (RightAlign ? "right" : "left")};

  @media screen and (max-width: 812px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    order: 2;
  }
`;

const SmallContentInfo = styled.div`
  background-color: #f3890d;
  text-align: center;
  width: 100%;
  font-size: 20px;
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 812px) {
    font-size: 15px;
  }

  & > * {
    padding: 0px;
  }

  &:hover {
    background-color: #eaeaea;
    color: #f3890d;

    & a {
      color: #f3890d;
    }
  }
`;

const ScrollToReferences = () => {
  scroller.scrollTo("References", {
    smooth: true,
    duration: 300,
    offset: -400,
  });
};

export function AboutPage(props) {
  return (
    <PageContainer>
      <Navbar otherpages="true" className="other-page" />
      <TextContainer>
        <Title>About Us</Title>
        <Description>
          With the shift from manufacturing to service and knowledge economies,
          greater emphasis is placed on communication and interpersonal skills
          like empathy{" "}
          <Anchur
            href="#/"
            className="link"
            onClick={() => {
              window.open(
                "https://www.forbes.com/sites/tracybrower/2019/06/16/think-empathy-is-a-soft-skill-think-again-why-you-need-empathy-for-success/?sh=7a06b06a76d6 ",
                "_blank"
              );
            }}
          >
            (McKean, 2018)
          </Anchur>
          . Empathy tends to get a 'bad rap' as a soft skill{" "}
          <Anchur
            href="#/"
            className="link"
            onClick={() => {
              window.open(
                "https://www.conferenceboard.ca/docs/default-source/education/9999_bschools-rpt.pdf",
                "_blank"
              );
            }}
          >
            (Brower, 2019)
          </Anchur>
          . But empathy fosters 'influence' and 'engagement' by sensitive
          collection of information, understanding, and selling ideas in
          business, design, law, health care, and education.
        </Description>
        <Description>
          We created the novel In Your Shoes (IYS) perspective-taking and
          video-feedback intervention, and a rating tool to capture perceptual
          understanding scores. IYS was adapted from{" "}
          <a className="ClickableLink" href="#/" onClick={ScrollToReferences}>
            Dr. William Ickes’ (1990, 1993)
          </a>{" "}
          award-winning research in social psychology on empathic accuracy (or
          the extent to which one’s inferences of another person’s thoughts and
          feelings are accurate). The multi-phased IYS intervention involves
          self-reflection, learning perspective-taking, video -capture,
          -tagging, and -analysis, and calculating one's perceptual
          understanding score (how accurate one is at inferring what others are
          thinking and feeling). <br />
          <br />
          The IYS web browser is a user-friendly, Internet-based application
          that runs on any browser, anywhere, and at any time to provide a
          powerful, yet simple empathy training experience.
        </Description>
        <div className="References" name="References">
          <h2 className="ReferencesTitle">References:</h2>
          Ickes, W., Bissonnette, V., Garcia, S., & Stinson, L.L. (1990)
          Implementing and using the dyadic interaction. In Hendrick, C., &
          Clark, M.S. (eds.). Research Methods in Personality and Social
          Psychology. Review of Personality and Social Psychology (Vol. 11).
          Sage Publications, Inc, Thousand Oaks, CA, pp 16-34. <br />
          <br />
          Ickes, W. (1993). Empathic accuracy. Journal of Personality, 61,
          587-610. doi:10.1111/j.1467-6494.1993.tb00783.x.
        </div>
      </TextContainer>
      <div id="research" style={{ height: "90px" }} />
      <SmallContentInfo>
        The research we have done can be found here.
        <FileDownload
          link="https://iys-storage.s3.us-east-2.amazonaws.com/IYS-Research_Documents.zip"
          description="IYS-Research_Documents.zip"
          noLine={true}
        />
      </SmallContentInfo>
      <InventorSection />
      <TextContainer>
        <Title>Acknowledgments</Title>
        <Description>
          Special thanks to our research colleagues for their wonderful
          collaboration in the CAreLab to develop and test our In Your Shoes
          intervention:
        </Description>
        <DescrptionList>
          <ul>
            <li>Dr. Gayle Halas</li>
            <li>Dr. Shaelyn Strachan</li>
            <li>Dr. Nicole Harder</li>
            <li>Dr. Christina West</li>
            <li>Ms. Cheryl Dika</li>
            <li>Ms. Wilma Schroeder</li>
            <li>Dr. Terri Ashcroft</li>
            <li>Dr. Kathleen Chambers Clouston</li>
            <li>Dr. Zulfiya Tursunova</li>
            <li>Ms. Chantal Ramraj</li>
            <li>Ms. Jocelyne Lemoine</li>
          </ul>
        </DescrptionList>
        <Description>
          We are also grateful for the advice, guidance, expertise, and/or
          creativity provided to us by:
        </Description>
        <DescrptionList>
          <ul>
            <li>ACE Project Space, Red River College</li>
            <li>Partnership and Innovation, University of Manitoba</li>
          </ul>
        </DescrptionList>
        <Description>
          We would like to acknowledge the participation and feedback provided
          to us by student participants in our studies in the CAreLab:
        </Description>
        <DescrptionList>
          <ul>
            <li>University of Manitoba</li>
            <li>Red River College</li>
          </ul>
        </DescrptionList>
      </TextContainer>
      <Footer />
    </PageContainer>
  );
}
