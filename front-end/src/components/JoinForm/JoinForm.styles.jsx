import styled from "styled-components";


export const JoinFormWrapper = styled.form`
  height: calc(100vh - 81px);

  .button {
    padding: 20px 25px 0;
    height: 10vh;
    text-align: end;
    border-top: 1px solid #e0e0e0;
}
`

export const FormContentWrapper = styled.div`
  height: 90%;
  padding: 25px;

  p {
    margin-bottom: 20px;
    font-weight: 600;

    span {
      font-weight: 400;
    }
  }

`