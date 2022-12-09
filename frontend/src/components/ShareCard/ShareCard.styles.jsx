import styled from "styled-components";


export const ShareCardWrapper = styled.div`
  position: relative;
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: ${(props) => props.shadow || '5px 5px rgba(0, 0, 0, 0.2)'};
  padding: 10px 15px;
  width: 500px;
  margin-bottom: 20px;

  button {
  position: absolute;
  top: 0;
  left: 100%;
  width: 90px;
}
`

export const ContentWrapper = styled.div`
display: flex;
flex-direction: ${(props) => props.direction || 'row'};
justify-content: space-between;
margin-top: 8px;

  strong {
  font-weight: 600;
  font-size: 16px;
}

  p {
  padding: 8px;
  height: 85px;
  overflow-y: scroll;
}

strong > span {
  font-weight: 400;
  font-size: 16px;
}
`

