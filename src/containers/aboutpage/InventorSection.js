/*
 * InventorSection.js: Component that is responsible for the inventor section in about page.
 *
 * Symon Kurt San Jose
 *
 *
 * Date Created: 4/24/2021
 * Last Updated: 4/24/2021
 */

import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import styled from "styled-components";

const Background = styled.div`
  background-color: #75accf;
  overflow: hidden;
  width: 100%;
  margin: 0px auto 1.5rem auto !important;
  padding: 3rem 1.5rem !important;
  @media screen and (max-width: 1024px) {
  }
`;

const InventorWrapper = styled.div`
  margin-top: calc(3rem * calc(1 - 0));
  margin-bottom: calc(3rem * 0);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  display: grid;
  gap: 1rem;
  @media screen and (max-width: 1024px) {
    display: block;
  }
`;

const InvName = styled.h3`
  overflow: hidden;
  color: #fff;
  margin: 0;
  font-family: "Roboto", sans-serif;

  ${({ FullNames }) => {
    if (FullNames) {
      return `
        font-size: 30px;
        font-weight: bold;
      `;
    } else {
      return `
        font-size: 16px;
        font-weight: normal;
      `;
    }
  }}

  padding-top: 0px;

  @media screen and (max-width: 1024px) {
    font-size: ${({ FullNames }) => (FullNames ? "25px" : "15px")};
  }
`;

const InvInfo = styled.div`
  width: 100%;
  grid-column: span 2 / span 2;
  color: white;

  @media screen and (max-width: 1024px) {
    grid-column: 2 / span 2;

    margin-top: calc(1rem * calc(1 - 0)) !important;
  }
`;

const Title = styled.h1`
  font-size: 50px;
  text-align: center;
  font-family: "Roboto", serif;
  font-weight: bold;
  margin-bottom: 60px;

  color: white;

  @media screen and (max-width: 456px) {
    font-size: 40px;
  }
`;

const InfoContainer = styled.div`
  grid-column: span 2 / span 2;

  @media screen and (max-width: 1024px) {
    grid-column: auto;
  }
`;

const InventorList = styled.ul`
  list-style-type: none;
  padding-left: 0;

  & > li {
    margin: 0;
  }

  & > li:not(:first-of-type) {
    padding-top: 50px;
  }

  & > li:not(:last-of-type) {
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 50px;
  }
`;

const InvWrapper = styled.div`
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  display: grid;
  align-items: flex-start;

  & > img {
    height: 200px;
  }

  @media screen and (max-width: 1024px) {
    display: block;

    & > img {
      height: 300px;
    }
  }
`;

export const InventorSection = () => {
  const InventorInfo = [
    {
      name: "Michelle Lobchuk",
      title: "Co-Founder",
      imgFileName: "images/michelle.jpg",
      description: `Dr. Lobchuk is an Associate Professor at the College
      of Nursing, Rady Faculty of Health Sciences,
      University of Manitoba, and former Research Manitoba
      Chair in Caregiver Communication. She is the
      co-principal user of the CFI-funded CAreLab located at
      the Grace Health Campus in Winnipeg where the In Your
      Shoes (IYS) video-feedback intervention was developed
      and tested.`,
      twitter: "#",
      linkedIn: "https://www.linkedin.com/in/michelle-lobchuk-31363610a",
    },
    {
      name: "Lisa Hoplock",
      title: "Co-Founder",
      imgFileName: "images/lisa.jpg",
      description: `Dr. Lisa Hoplock is currently a researcher in the technology
        sector. She has a background in social psychology and worked as a
        post-doctoral fellow for Dr. Lobchuk. As a post-doctoral fellow,
        she worked on the perspective-taking intervention by, for example,
        applying it to a video-conferencing context.`,
      twitter: "#",
      linkedIn: "https://www.linkedin.com/in/lisahoplock/",
    },
    {
      name: "Julie Rempel",
      title: "Co-Founder",
      imgFileName: "images/julie.png",
      description: `Julie Rempel is currently a research coordinator at the University of Manitoba. She has a background in community nutrition and
      Public Health and Project Management. She is involved with the In
      Your Shoes (IYS) as a project coordinator and entrepreneur.`,
      twitter: "#",
      linkedIn: "#",
    },
  ];

  return (
    <Background>
      <InventorWrapper>
        <Title>The Inventors</Title>
        <InfoContainer>
          <InventorList>
            {InventorInfo.map((inventor, index) => {
              return (
                <li key={index}>
                  <ScrollAnimation
                    animateOnce={true}
                    animateIn="animate__slideInRight"
                  >
                    <InvWrapper>
                      <img
                        className="rounded-lg"
                        src={inventor.imgFileName}
                        alt={inventor.name}
                        style={{
                          maxWidth: "150%",
                          display: "inline-block",
                        }}
                      />
                      <InvInfo>
                        <div>
                          <InvName FullNames={true}>{inventor.name}</InvName>
                          <InvName>Co-Founder</InvName>
                        </div>
                        <div>
                          <p style={{ margin: "1rem 0 0 0" }}>
                            {inventor.description}
                          </p>
                        </div>
                        <ul
                          style={{
                            display: "flex",
                            margin: "1rem 0 0 0",
                            padding: "0",
                            listStyleType: "none",
                          }}
                        >
                          {/* <li>
                          <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Twitter</span>
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                        </li> */}
                          <li>
                            <a href={inventor.linkedIn} target="_blank" style={{ color: "inherit" }}>
                              <span className="sr-only">LinkedIn</span>
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                style={{ width: "30px" }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          </li>
                        </ul>
                      </InvInfo>
                    </InvWrapper>
                  </ScrollAnimation>
                </li>
              );
            })}
          </InventorList>
        </InfoContainer>
      </InventorWrapper>
    </Background>
  );
};
