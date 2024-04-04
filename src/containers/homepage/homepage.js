/*
Creating the homepage of the website.

Author: Lawrence Valerio
Date: 01/21/2021
Update Date:
*/

import React from "react";
import styled from "styled-components";
import { BottomSection } from "./bottomSection";
import { Footer } from "../Footer/footer";
import { TopSection } from "./topSection";

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export function Homepage(props) {
  return (
    <PageContainer>
      <TopSection />
      <BottomSection />
      <Footer />
    </PageContainer>
  );
}
