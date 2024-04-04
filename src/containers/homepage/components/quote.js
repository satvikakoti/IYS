import React from "react";
import styled from "styled-components";

const QuoteContainer = styled.div``;

const QuoteText = styled.h1``;

export function Quote(props) {
  return (
    <QuoteContainer>
      <QuoteText>
        "Cognitive empathy is the imaginative ability to step inside someone
        else's shoes to understand their thoughts and feelings, communicate that
        understanding to check for accuracy, and act on that understanding in a
        helpful way."
      </QuoteText>
    </QuoteContainer>
  );
}
