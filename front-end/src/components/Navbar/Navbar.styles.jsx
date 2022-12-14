import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  padding: 10px 20px;
  background-color: #fff;

  > div {
    display: flex;
    align-items: center;
  }
`;

export const LogoContainer = styled.div`
  width: 60px;
  height: 60px;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

export const BrandName = styled(Link)`
  color: ${(props) => props.theme.black};
`;

export const NavTab = styled(Link)`
  display: inline-block;
  color: ${(props) => props.theme.black};
  font-weight: 700;
  padding: 10px;

  > * {
    vertical-align: middle;
  }
`;
