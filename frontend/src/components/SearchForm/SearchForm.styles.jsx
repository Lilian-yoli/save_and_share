import styled from "styled-components";

export const FormfieldWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
  gap: 20px;
  position: ${props => props.variant ? 'absolute' : 'static'};
  left: 0;
  right: 0;
  bottom: 6px;
  height: 80px;
  margin: auto;

  > * {
    width: 195px;
  }

  .customized {
    label,
    input,
    div {
      color: ${props => props.variant ? '#fff' : '#777'};
    }

    fieldset {
      border-color: ${props => props.variant ? '#fff' : '#777'};
    }

    fieldset:focus {
      border-color: ${props => props.variant ? '#fff' : '#777'} !important;
    }
  }

  button {
    height: 56px;
  }
`;
