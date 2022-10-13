import styled from "styled-components";

export const HeroContainer = styled.section`
  width: 100%;
  height: 500px;
  position: relative;
  background: ${(props) => props.theme.subSystem};

  h2 {
    width: fit-content;
    margin: 0 auto;
    position: absolute;
    top: 10%;
    left: 10%;
    color: snow;
    font-size: 30px;
  }
`;

export const ImgContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 75%;
  padding: 20px;
  margin: 0 auto;
`;

export const InitiateSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 350px;
  background: ${(props) => props.theme.system};

  > div {
    flex: 0 1 40%;
  }

  p:first-child {
    font-size: 24px;
    font-weight: 700;
  }

  p:nth-child(2) {
    font-size: 16px;
    font-weight: 500;
    color: #555;
  }

  button {
    margin-top: 10px;
  }
`;

export const Footer = styled.footer`
  padding: 30px 40px;
  background: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    // text-align-last: right;
  }
`;
