/**
 * Creating the bottom section of the homepage.
 * Author: Lawrence Valerio, Symon Kurt San Jose
 *
 *
 * Date: 01/21/2021
 * Update Date: 04/12/2021
 */

import React from "react";
import styled from "styled-components";
import {
  faChartArea,
  faUsers,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HashLink } from "react-router-hash-link";
import "./components/homepage.css";
import { PopUpDefinition } from "../generalComponents/PopUpDefinition";
import { PersonQuote } from "../generalComponents/PersonQuote";

const BottomSectionContainer = styled.main`
  background-color: #fff;
  width: 100%;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 812px) {
    min-height: 800px;
  }
`;

const ImageContainer = styled.img`
  width: 400px;
  height: 300px;
  margin-right: 8%;
  border-radius: 30px;
  @media screen and (max-width: 812px) {
    order: 1;
    width: 300px;
    height: 200px;
    margin-bottom: 2em;
    margin-right: 0px;
  }
`;

const ImportantPointSection = styled.section`
  background-color: #a8dadc;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0px 20%;
  justify-content: space-around;

  @media screen and (max-width: 1264px) {
    padding: 0;
  }
`;

const AspectPoint = styled.div`
  width: 33.3333%;
  padding-top: 50px;
  padding-bottom: 50px;
  overflow: hidden;
  color: #0077b6;
  background-color: #a8dadc;

  & > * {
    text-align: center;
    margin: 0;
  }

  @media screen and (max-width: 812px) {
    width: 100%;
    padding: 40px 0px;
  }

  @media screen and (max-width: 456px) {
    padding: 20px 0px;
  }
`;

const AspectTitle = styled.p`
  margin-top: 30px;
  font-size: 30px;

  @media screen and (max-width: 812px) {
    font-size: 20px;
    margin-top: 15px;
  }

  @media screen and (max-width: 456px) {
    font-size: 15px;
  }
`;

const AspectDescription = styled.p`
  font-size: 16px;

  @media screen and (max-width: 812px) {
    font-size: 12px;
  }

  @media screen and (max-width: 456px) {
    font-size: 10px;
  }
`;

const AwesomeIcon = styled(FontAwesomeIcon)`
  font-size: ${({ helplink }) => (helplink ? "15px" : "90px")};

  @media screen and (max-width: 812px) {
    font-size: ${({ helplink }) => (helplink ? "14px" : "60px")};
  }

  @media screen and (max-width: 456px) {
    font-size: ${({ helplink }) => (helplink ? "14px" : "40px")};
  }
`;

const FeatureContentSection = styled.section`
  width: 100%;
  color: #333333;

  &:last-of-type {
    padding-bottom: 50px;
  }
`;

const ContentSection = styled.div`
  margin: 30px auto;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  & > div {
    alignitems: "center";
    flex: 3;
    <<<<<<< HEAD @media screen and (max-width: 812px) {
      width: "100%";
    }
  }

  & .HomePageTitle {
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    margin-bottom: 30px;

    @media screen and (max-width: 812px) {
      font-size: 25px;
    }
  }

  & .HomePageSubtext {
    font-size: 20px;
    text-align: center;
    font-weight: normal;

    @media screen and (max-width: 812px) {
      font-size: 18px;
      width: 90%;
    }
  }

  & > div > * {
    margin: auto;
  }

  & > div > *:not(HelpfulLink) {
    width: 80%;
  }

  & p,
  & article {
    font-size: 20px;
    margin-bottom: 5px;

    @media screen and (max-width: 812px) {
      font-size: 18px;
    }
  }

  & .KeyFeatures {
    font-weight: normal;
    font-size: 40px;
    margin-bottom: 30px;

    @media screen and (max-width: 812px) {
      font-size: 25px;
    }
  }

  & li {
    font-size: 20px;

    @media screen and (max-width: 812px) {
      font-size: 18px;
    }
  }

  @media screen and (max-width: 812px) {
    flex-direction: column;
  }
`;

const HelpfulLink = styled.ul`
  flex: 1;
  margin: 80px 0px 0px 20px;
  list-style-postion: inside;
  list-style-type: none;
  float: right;
  text-align: left;
  padding: 5px 0px 5px 0px;
  border-left: 2px solid #3c271f;

  & > li {
    & a {
      padding: 0px 0px 0px 20px;
      transition-duration: 0.5s;
    }

    & a:hover {
      padding: 10px 40px;
      text-decoration: none;
      background-color: #f2a900;
      color: #3c271f;
    }
  }
`;

export function BottomSection(props) {
  return (
    <BottomSectionContainer name="bottomSection" id="bottomSection">
      <ImportantPointSection>
        <AspectPoint>
          <div>
            <AwesomeIcon icon={faWifi} />
          </div>
          <AspectTitle>Online-Training</AspectTitle>
          <AspectDescription>Train at home</AspectDescription>
        </AspectPoint>
        <AspectPoint>
          <div>
            <AwesomeIcon icon={faUsers} />
          </div>
          <AspectTitle>School/Company Friendly</AspectTitle>
          <AspectDescription>Invite your people</AspectDescription>
        </AspectPoint>
        <AspectPoint>
          <div>
            <AwesomeIcon icon={faChartArea} />
          </div>
          <AspectTitle>Statistics</AspectTitle>
          <AspectDescription>See your scores</AspectDescription>
        </AspectPoint>
      </ImportantPointSection>
      <FeatureContentSection>
        <ContentSection>
          <div>
            <h1 className="KeyFeatures">Key Features</h1>
            <p>
              The In Your Shoes (IYS) training session is about learning how to
              engage in cognitive empathy, also known as{" "}
              <PopUpDefinition
                word="perspective-taking"
                definition="An effortful mental activity where an individual attempts to understand their dialogue partner’s thoughts and feelings. It involves self-awareness, self-control, imagination, and validation. "
              />
              .
            </p>
            <p>
              Perspective-taking will help you to work more effectively with
              people. Seeing how your dialogue partners see the world can
              improve how you communicate, interpret, and understand their
              thoughts, beliefs, preferences, experiences, intentions,
              motivations, and feelings. Skilled “perspective-takers” build
              trust, show consideration, foster engagement, encourage shared
              decision-making, anticipate needs, sell ideas, and collect
              sensitive information.
            </p>
            <p>
              This training session covers the following key steps that should
              be done with your dialogue partner to build your
              perspective-taking skill and{" "}
              <PopUpDefinition
                word="perceptual understanding score"
                definition="Perceptual Understanding Score  reflects one's understanding of another person’s thoughts and feelings out of 100% (perfect understanding). "
              />
              .
            </p>
            <ImageContainer
              src="images/KeyFeatures.png"
              alt="KeyFeatures"
              className="StepsDiagram"
            />
            <p>After taking this training session, you will be able to:</p>
            <ol className="ContentList">
              <li>
                Control your beliefs, preferences, and biases when trying to
                understand another person,{" "}
              </li>
              <li>
                Wear the other person’s lens to see the situation from their
                viewpoint,
              </li>
              <li>
                Communicate and validate your understanding of another person’s
                viewpoint,
              </li>
              <li>Anticipate and meet another person’s needs,</li>
              <li>
                Track your progress by downloading and replaying your annotated
                and time-stamped video, and
              </li>
              <li>
                Access integrated support features and resource links for
                building your perspective-taking skill.
              </li>
            </ol>
          </div>
        </ContentSection>
      </FeatureContentSection>
      <PersonQuote />
      <FeatureContentSection>
        <ContentSection>
          <div>
            <h1 className="KeyFeatures">What to do</h1>
            <p>To do this application, you must:</p>
            <ul className="ContentList">
              <li>
                Click here to open the{" "}
                <HashLink {...props} smooth to="/TrainingPortal#topSection">
                  Training Portal
                </HashLink>
                . At <b>Before You Begin</b>, read each of the 8 training session steps
                to build perspective-taking skills beforehand to learn more
                about the website as a service.
              </li>
              <li>
                Pick a suitable subscription type for you and/or your group{" "}
                <HashLink {...props} smooth to="/Pricing#topSection">
                  here
                </HashLink>
                .
              </li>
            </ul>
          </div>
        </ContentSection>
      </FeatureContentSection>
    </BottomSectionContainer>
  );
}
