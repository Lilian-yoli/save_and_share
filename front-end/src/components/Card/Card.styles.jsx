import styled from "styled-components";

export const CardContainer = styled.div`
  color: ${(props) => props.theme.black};
  padding: 20px;
  width: 200px;
  border-radius: 16px;
  text-align: center;

  p {
    margin-top: 15px;
    font-weight: 500;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
  }
`;
