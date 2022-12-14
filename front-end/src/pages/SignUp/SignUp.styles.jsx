import styled from "styled-components";
import { Link } from "react-router-dom";

export const LinkToSignInPage = styled(Link)`
  color: ${(props) => props.theme.contrast};
  font-size: 1rem;
  display: inline-block;
  margin-top: 15px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.vertical ? "column" : "row")};
  justify-content: center;
  gap: ${(props) => props.gap || "0px"};
  max-width: ${(props) => props.width || "auto"};
  margin: 40px auto 0;
  padding: 0 20px;

  h2 {
    width: fit-content;
    font-size: 2rem;
    color: ${(props) => props.theme.system};
  }

  form {
    margin-top: 15px;
  }

  ${LinkToSignInPage} {
    align-self: end;
  }
`;
