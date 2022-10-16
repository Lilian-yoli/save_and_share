import styled from "styled-components";

export const FormfieldWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: top;
  gap: 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  width: 80%;
  height: 80px;
  margin: auto;

  > * {
    width: 195px;
  }

  .customized {
    label,
    input,
    div {
      color: #fff;
    }

    fieldset {
      border-color: #fff;
    }

    fieldset:focus {
      border-color: #fff !important;
    }
  }

  button {
    height: 56px;
  }
`;
