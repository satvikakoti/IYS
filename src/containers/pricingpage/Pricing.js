import React from "react";
import styled from "styled-components";
import { Navbar } from "../Navbar/navbar";
import { Footer } from "../Footer/footer";
import { HashLink } from "react-router-hash-link";
import "animate.css";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.main`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 100px;

  margin-top: ${({ Team }) => (Team ? "0em" : "6em")};
  background-color: ${({ Team }) => (Team ? "#75ACCF" : "#FFF")};
`;

const PriceExplanation = styled.div`
  color: #fff;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;

  & > h1 {
    text-shadow: -1px 1px #eaeaea;
  }
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

const PriceTitle = styled.h1`
  color: #fff;
  font-size: 3rem;
  font-weight: bold;
  margin: 20px 0px 0px 0px;
  padding: 0;
`;

const Price = styled.div`
  position: static;
  margin: 30px 0px;

  & > * {
    display: inline-block;
    text-shadow: 1px 1px #eaeaea;
    color: #fff;
    margin: 0;
    padding: 0;
  }

  & > h1 {
    font-size: 5.5rem;
  }

  & > h2 {
    position: relative;
    bottom: 20px;
    font-size: 3.5rem;
  }

  & > h4 {
    position: relative;
    bottom: 40px;
    font-size: 2.5rem;
  }
`;

const SmallExplanation = styled.p`
  margin: 0px 20px;
  font-size: 1rem;
  display: block;
  min-height: 70px;
`;

const DetailLink = styled(HashLink)`
  display: inline-block;
  margin: 20px 0px;
  color: #a8dadc;
`;

const TypeExplanation = styled.div`
  color: #000;
  border-radius: 10px;

  & > h1 {
    text-shadow: -1px 1px #eaeaea;
  }
`;

const Btn = styled.button`
  font-size: 2rem;
  color: #fff;
  width: 100%;
  margin: 0;

  &:hover {
    transition-duration: 150ms;
    box-shadow: inset 0 0 0 99999px rgba(0, 0, 0, 0.2);
  }
`;

const SmallTypeExplanation = styled.p`
  margin: 20px 0px 0px 0px;
  font-size: 1rem;
  display: block;
  min-height: 70px;
`;

const ExplanationSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px 20% 50px 20%;
  width: 80%;

  & > * {
    flex-basis: 23%;
  }

  @media only screen and (max-width: 812px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export function Pricing() {
  return (
    <PageContainer>
      <Navbar otherpages="true" className="other-page" />
      <TextContainer>
        <Title>Pricing Details</Title>

        <ExplanationSection>
          <div>
            <PriceExplanation style={{ backgroundColor: "#8A74B9" }}>
              <PriceTitle>Free-Trial</PriceTitle>
              <Price>
                <h2>$</h2>
                <h1>0</h1>
                <h4>00</h4>
              </Price>
              <SmallExplanation>
                Test our service with a free trial
              </SmallExplanation>
              <DetailLink smooth to="/Pricing#free-trial">
                details
              </DetailLink>
            </PriceExplanation>
            <TypeExplanation id="free-trial">
              <Btn style={{ backgroundColor: "#8A74B9" }}>Buy</Btn>

              <SmallTypeExplanation>
                Coming Soon. Stay Tuned or contact us for more information.
              </SmallTypeExplanation>
            </TypeExplanation>
          </div>
          <div>
            <PriceExplanation style={{ backgroundColor: "#4CB992" }}>
              <PriceTitle>Individual</PriceTitle>
              <Price>
                <h2>$</h2>
                <h1>6</h1>
                <h4>99</h4>
              </Price>
              <SmallExplanation>
                For individuals planning to improve their empathic skills
              </SmallExplanation>
              <DetailLink smooth to="/Pricing#individual">
                details
              </DetailLink>
            </PriceExplanation>
            <TypeExplanation id="individual">
              <Btn style={{ backgroundColor: "#4CB992" }}>Buy</Btn>

              <SmallTypeExplanation>
                Coming Soon. Stay Tuned or contact us for more information.
              </SmallTypeExplanation>
            </TypeExplanation>
          </div>
          <div>
            <PriceExplanation style={{ backgroundColor: "#3499E0" }}>
              <PriceTitle>Pro</PriceTitle>
              <Price>
                <h2>$</h2>
                <h1>35</h1>
                <h4>99</h4>
              </Price>
              <SmallExplanation>
                For small groups investing in improving skills relating to their
                day-to-day job
              </SmallExplanation>
              <DetailLink smooth to="/Pricing#pro">
                details
              </DetailLink>
            </PriceExplanation>
            <TypeExplanation id="pro">
              <Btn style={{ backgroundColor: "#3499E0" }}>Buy</Btn>
              <SmallTypeExplanation>
                Coming Soon. Stay Tuned or contact us for more information.
              </SmallTypeExplanation>
            </TypeExplanation>
          </div>
          <div>
            <PriceExplanation style={{ backgroundColor: "#EFB57C" }}>
              <PriceTitle>Advanced</PriceTitle>
              <Price>
                <h2>$</h2>
                <h1>124</h1>
                <h4>99</h4>
              </Price>
              <SmallExplanation>
                For businesses looking to build a lasting brand and drive growth
              </SmallExplanation>
              <DetailLink smooth to="/Pricing#advanced">
                details
              </DetailLink>
            </PriceExplanation>
            <TypeExplanation id="advanced">
              <Btn style={{ backgroundColor: "#EFB57C" }}>Buy</Btn>

              <SmallTypeExplanation>
                Coming Soon. Stay Tuned or contact us for more information.
              </SmallTypeExplanation>
            </TypeExplanation>
          </div>
        </ExplanationSection>
      </TextContainer>
      <Footer />
    </PageContainer>
  );
}
