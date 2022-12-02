import styled from "styled-components";

export const PlanCardWrapper = styled.div`
  width: 300px;
  height: 360px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 2px solid ${(props) => props.theme.system};
  border-radius: 8px;
  color: ${(props) => props.theme.subSystem};

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
  }

  p {
    font-size: 1.4rem;
    font-weight: 500;
    text-align: center;
    margin-top: 20px;
  }

  ul {
    margin-top: 35px;
  }

  li {
    text-align: center;
  }

  li + li {
    margin-top: 12px;
  }

  button {
    margin-top: auto;
    cursor: pointer;
  }
`;
